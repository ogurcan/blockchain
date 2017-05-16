pragma solidity ^0.4.10;

/* Contract managing reputations of stakeholders */
contract ReputationSystem {
    
    // contract information
    address contractOwner;
    
    struct Stakeholder {
        string name; // stakeholder name
        address id; // id as address
        uint profession; // 0 food provider, 1 breeder, 2 alive pig carrier, 3 slaughterhouse, 4 cool meat carrier, 5 brand
    }
    
    mapping (address => Stakeholder) stakeholders;
    
    // 1st index evaluator profession, 2nd index evaluated profession
    mapping (uint => mapping(uint => bool)) evaluationRelationships;
    
    struct BusinessProcess {
        address foodProviderID;
        address breederID;
        address pigCarrierID;
        address slaughterHouseID;
        address meatCarrierID;
        address brandID;
        uint stage; // 0 no evaluation, 1: breeder evaluated, 2: pig carrier evaluated, 
                    // 3: slaughterhouse evaluated, 4 meat carrier evaluated, 5: brand evaluated
    }
    
    mapping (uint => BusinessProcess) businessProcessList;
    uint businessProcessID = 0;
    
    struct Evaluation {
        uint businessProcessID; // for which business process
        address evaluatorID; // by which stakeholder
        address evaluatedID; // for which stakeholder
        uint weight; // reputation level of the evaluator at evalution time
        uint score; // score value of the evaluator
    }
    
    // Evaluation list holding all evaluations
    mapping (uint => Evaluation) public evaluations;
    uint evaluationCount = 0;
   
    /* Constructor */
    function ReputationSystem() {
        // set the owner of this contract
        contractOwner = msg.sender;
        
        // since default bool value is false we just need to set the true ones
        // 1 can evaluate 0 and 2.
        evaluationRelationships[1][0] = true;
        evaluationRelationships[1][2] = true;
        // 2 can evaluate 1.
        evaluationRelationships[2][1] = true;
        // 3 can evaluate 1, 2 and 4.
        evaluationRelationships[3][1] = true;
        evaluationRelationships[3][2] = true;
        evaluationRelationships[3][4] = true;
        // 4 can evaluate 3.
        evaluationRelationships[4][3] = true;
        // 5 can evaluate 3 and 4.
        evaluationRelationships[5][3] = true;
        evaluationRelationships[5][4] = true;
    }  
    
    /* Add stakeholders to the system. */ 
    function addStakeholder(string name, address id, uint profession) {
        stakeholders[id] = Stakeholder(name, id, profession);
    }
    
    /* Create a business between stakeholders */
    function createBusiness(address foodProviderID, address breederID, address pigCarrierID, 
                            address slaughterHouseID, address meatCarrierID, address brandID) {
        if ((stakeholders[foodProviderID].profession == 0) && (stakeholders[breederID].profession == 1) &&
            (stakeholders[pigCarrierID].profession == 2) && (stakeholders[slaughterHouseID].profession == 3) &&
            (stakeholders[meatCarrierID].profession == 4) && (stakeholders[brandID].profession == 5))
          
            businessProcessList[businessProcessID++] = BusinessProcess(foodProviderID, breederID, pigCarrierID, 
                            slaughterHouseID, meatCarrierID, brandID, 0);
    }
    
    /* Reputate a stakeholder (evaluated) for a business with a score from 0 to 3. */
    function reputate(uint businessProcessID, address evaluatedID, uint score) {
        address evaluatorID = msg.sender;
        Stakeholder evaluator = stakeholders[evaluatorID];
        Stakeholder evaluated = stakeholders[evaluatedID];
        
        if (canReputate(businessProcessID, evaluator, evaluated)) {
            uint reputationOfEvaluator = getReputation(evaluatorID);
            Evaluation evaluation = Evaluation(businessProcessID, evaluatorID, evaluatedID, reputationOfEvaluator, score);
            evaluations[evaluationCount++] = evaluation;
        }
    }
    
    /* Check if the evaluator can reputate the evaluated for the business */ 
    function canReputate(uint businessProcessID, Stakeholder evaluator, Stakeholder evaluated) private constant returns (bool result) {
        // check if these stakeholders are in this business
        bool b1 = isInsideBusinessProcess(businessProcessID, evaluator.id);
        bool b2 = isInsideBusinessProcess(businessProcessID, evaluated.id);
        
        // check if the evaluator has not already reputated the evaluated // TODO
        
        // check if evaluator can evaluate the evaluated regarding to the relation rules
        bool b3 = evaluationRelationships[evaluator.profession][evaluated.profession];
        
        // if all are true return true, false otherwise.
        return (b1 && b2 && b3);
    }
    
    function isInsideBusinessProcess(uint businessProcessID, address stakeholderID) constant returns (bool result) {
        BusinessProcess businessProcess = businessProcessList[businessProcessID];
        Stakeholder stakeholder = stakeholders[stakeholderID];
        bool c0 = (stakeholder.profession == 0) && (stakeholderID == businessProcess.foodProviderID);
        bool c1 = (stakeholder.profession == 1) && (stakeholderID == businessProcess.breederID);
        bool c2 = (stakeholder.profession == 2) && (stakeholderID == businessProcess.pigCarrierID);
        bool c3 = (stakeholder.profession == 3) && (stakeholderID == businessProcess.slaughterHouseID);
        bool c4 = (stakeholder.profession == 4) && (stakeholderID == businessProcess.meatCarrierID);
        bool c5 = (stakeholder.profession == 5) && (stakeholderID == businessProcess.brandID);
        return (c0 || c1 || c2 || c3 || c4 || c5);
    }    
    
    /* Calculate and return the reputation value for the given stakeholder. */
    function getReputation(address stakeholderID) constant returns (uint reputation) {
        uint totalWeight = 0;
        uint totalWeightedScore = 0;
        
        for (uint i = 0; i < evaluationCount - 1; i++) {
            Evaluation evaluation = evaluations[i];
            if (evaluation.evaluatedID == stakeholderID) {
               totalWeight += evaluation.weight;
               totalWeightedScore += evaluation.weight * evaluation.score;
            }
        }
        
        return totalWeightedScore/totalWeight;
    }
}
