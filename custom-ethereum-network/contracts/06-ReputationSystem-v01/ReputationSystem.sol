pragma solidity ^0.4.11;

/* Contract managing reputations of stakeholders */
contract ReputationSystem {
    
    // contract information
    address contractOwner;
    
    struct Stakeholder {
        string name; // stakeholder name
        address id; // id as address
        uint role; // 0 food provider, 1 breeder, 2 animal carrier, 
                         // 3 slaughterhouse, 4 refrigerated carrier, 5 brand
    }
    
    mapping (address => Stakeholder) public stakeholders;
    event StakeholderAdded(string name, address id, uint role);
    
    // 1st index evaluator role, 2nd index evaluated role
    mapping (uint => mapping(uint => bool)) public feedbackRelationships;
    
    struct BusinessProcess {
        address foodProviderID;
        address breederID;
        address animalCarrierID;
        address slaughterHouseID;
        address refrigeratedCarrierID;
        address brandID;
    }
    
    mapping (uint => BusinessProcess) public businessProcessList;
    uint businessProcessID = 1; // starts from 1
    event BusinessProcessCreated(uint bpID);
    
    struct Feedback {
        uint businessProcessID; // for which business process
        address evaluatorID; // by which stakeholder
        address evaluatedID; // for which stakeholder
        uint weight; // reputation level of the evaluator at evalution time
        uint rate; // rate value of the evaluator
    }
    
    // Feedback list holding all feedbacks
    mapping (uint => Feedback) public feedbacks;
    uint feedbackCount = 0;
    
    event FeedbackGiven(uint businessProcessID, string evaluatorName, string evaluatedName, uint rate);
   
    /* Constructor */
    function ReputationSystem() {
        // set the owner of this contract
        contractOwner = msg.sender;
        
        // since default bool value is false we just need to set the true ones
        // 1 can evaluate 0 and 2.
        feedbackRelationships[1][0] = true;
        feedbackRelationships[1][2] = true;
        // 2 can evaluate 1.
        feedbackRelationships[2][1] = true;
        // 3 can evaluate 1, 2 and 4.
        feedbackRelationships[3][1] = true;
        feedbackRelationships[3][2] = true;
        feedbackRelationships[3][4] = true;
        // 4 can evaluate 3.
        feedbackRelationships[4][3] = true;
        // 5 can evaluate 3 and 4.
        feedbackRelationships[5][3] = true;
        feedbackRelationships[5][4] = true;
    }  
    
    /* Add stakeholders to the system. */ 
    function addStakeholder(string name, uint role) {
        address id = msg.sender;
        stakeholders[id] = Stakeholder(name, id, role);
        StakeholderAdded(name, id, role);
    }
    
    /* Create a business between stakeholders */
    function createBusinessProcess(address foodProviderID, address breederID, address animalCarrierID, 
                            address slaughterHouseID, address refrigeratedCarrierID, address brandID) {
        if ((stakeholders[foodProviderID].role == 0) && (stakeholders[breederID].role == 1) &&
            (stakeholders[animalCarrierID].role == 2) && (stakeholders[slaughterHouseID].role == 3) &&
            (stakeholders[refrigeratedCarrierID].role == 4) && (stakeholders[brandID].role == 5)) {
          
            businessProcessList[businessProcessID] = BusinessProcess(foodProviderID, breederID, animalCarrierID, 
                            slaughterHouseID, refrigeratedCarrierID, brandID);
            BusinessProcessCreated(businessProcessID);
            businessProcessID++;
        } else throw;
    }
    
    /* Rate a stakeholder (evaluated) for a business with a rate from 0 to 3. */
    function rate(uint businessProcessID, address evaluatedID, uint rate) {
        address evaluatorID = msg.sender;
        Stakeholder evaluator = stakeholders[evaluatorID];
        Stakeholder evaluated = stakeholders[evaluatedID];
        
        if (canRate(businessProcessID, evaluator, evaluated)) {
            uint reputationOfEvaluator = getReputation(evaluatorID);
            feedbacks[feedbackCount++] = Feedback(businessProcessID, evaluatorID, evaluatedID, reputationOfEvaluator, rate);
            FeedbackGiven(businessProcessID, evaluator.name, evaluated.name, rate);
        }
    }
    
    /* Check if the evaluator can rate the evaluated for the business */ 
    function canRate(uint businessProcessID, Stakeholder evaluator, Stakeholder evaluated) private constant returns (bool result) {
        // check if these stakeholders are in this business
        bool b1 = isInsideBusinessProcess(businessProcessID, evaluator.id);
        bool b2 = isInsideBusinessProcess(businessProcessID, evaluated.id);
        
        // check if the evaluator has not already reputated the evaluated // TODO
        
        // check if evaluator can evaluate the evaluated regarding to the relation rules
        bool b3 = feedbackRelationships[evaluator.role][evaluated.role];
        
        // if all are true return true, false otherwise.
        return (b1 && b2 && b3);
    }
    
    function isInsideBusinessProcess(uint businessProcessID, address stakeholderID) constant returns (bool result) {
        BusinessProcess businessProcess = businessProcessList[businessProcessID];
        Stakeholder stakeholder = stakeholders[stakeholderID];
        bool c0 = (stakeholder.role == 0) && (stakeholderID == businessProcess.foodProviderID);
        bool c1 = (stakeholder.role == 1) && (stakeholderID == businessProcess.breederID);
        bool c2 = (stakeholder.role == 2) && (stakeholderID == businessProcess.animalCarrierID);
        bool c3 = (stakeholder.role == 3) && (stakeholderID == businessProcess.slaughterHouseID);
        bool c4 = (stakeholder.role == 4) && (stakeholderID == businessProcess.refrigeratedCarrierID);
        bool c5 = (stakeholder.role == 5) && (stakeholderID == businessProcess.brandID);
        return (c0 || c1 || c2 || c3 || c4 || c5);
    }    
    
    /* Calculate and return the rate value for the given stakeholder. 
       Returns 1.5 if the stakeholder has never been rated before. */
    function getReputation(address stakeholderID) constant returns (uint) {
        uint totalWeight = 2; // initial weight for everyone 
        uint totalWeightedRate = 3; // initial weighted rate for everyone
        
        for (uint i = 0; i < feedbackCount; i++) {
            Feedback feedback = feedbacks[i];
            if (feedback.evaluatedID == stakeholderID) {
               totalWeight += feedback.weight;
               totalWeightedRate += feedback.weight * feedback.rate;
            }
        }
        
        return totalWeightedRate/totalWeight; // calculated reputation value
    }
}
