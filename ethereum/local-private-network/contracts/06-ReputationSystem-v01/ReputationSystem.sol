pragma solidity ^0.4.10;

/* Contract managing reputations of stakeholders */
contract ReputationSystem {
    
    // contract information
    address contractOwner;
    
    struct Stakeholder {
        string name; // stakeholder name
        address account; // account address
        uint profession; // 0 food provider, 1 breeder, 2 alive pig carrier, 3 slaughterhouse, 4 cool meat carrier, 5 brand
    }
    
    mapping (address => Stakeholder) stakeholders;
     
    mapping (address => Stakeholder[]) evaluationRelationships;
    
    struct Business {
        address foodProviderAccount;
        address breederAccount;
        address pigCarrierAccount;
        address slaughterHouseAccount;
        address meatCarrierAccount;
        address brandAccount;
        uint stage; // 0 no evaluation, 1: breeder evaluated, 2: pig carrier evaluated, 
                    // 3: slaughterhouse evaluated, 4 meat carrier evaluated, 5: brand evaluated
    }
    
    mapping (uint => Business) businessList;
    uint businessID = 0;
    
    struct Evaluation {
        uint weight; // reputation level of the evaluator at evalution time
        uint score; // score value of the evaluator
    }
    
    mapping (address => Evaluation[]) evaluations;
   
    /* Constructor */
    function ReputationSystem() {
        // set the owner of this contract
        contractOwner = msg.sender;
    }  
    
    /* Add stakeholders to the system. */ 
    function addStakeholder(string name, address account, uint profession) {
        stakeholders[account] = Stakeholder(name, account, profession);
    }
    
    /*
     * 1 can evaluate 0 and 2.
     * 2 can evaluate 1.
     * 3 can evaluate 1, 2 and 4.
     * 4 can evaluate 3.
     * 5 can evaluate 3 and 4.
     */
    function addEvalutionRelationship(address evaluatedAddress) {
       address evaluatorAddress = msg.sender;
       Stakeholder evaluator = stakeholders[evaluatorAddress];
       Stakeholder evaluated = stakeholders[evaluatedAddress];
       
       if (evaluator.profession == 1) {
           if ((evaluated.profession == 0) || (evaluated.profession == 2)) {
               // add as evaluator
               evaluationRelationships[evaluator.account].add(evaluated.account);
           }
       } else if (evaluator.profession == 2) {
           if (evaluated.profession == 1) {
               // add as evaluator
               evaluationRelationships[evaluator.account].add(evaluated.account);
           }
       } else if (evaluator.profession == 3) {
           if ((evaluated.profession == 1) || (evaluated.profession == 2) || (evaluated.profession == 4)) {
               // add as evaluator
               evaluationRelationships[evaluator.account].add(evaluated.account);
           }
       } else if (evaluator.profession == 4) {
           if (evaluated.profession == 3) {
               // add as evaluator
               evaluationRelationships[evaluator.account].add(evaluated.account);
           }
       } else if (evaluator.profession == 5) {
           if ((evaluated.profession == 3) || (evaluated.profession == 4)) {
               // add as evaluator
               evaluationRelationships[evaluator.account].add(evaluated.account);
           }
       }
    }
    
    /* Create a business between stakeholders */
    function createBusiness(address foodProviderAccount, address breederAccount, address pigCarrierAccount, 
                            address slaughterHouseAccount, address meatCarrierAccount, address brandAccount) {
        if ((stakeholders[foodProviderAccount].profession == 0) && (stakeholders[breederAccount].profession == 1) &&
            (stakeholders[pigCarrierAccount].profession == 2) && (stakeholders[slaughterHouseAccount].profession == 3) &&
            (stakeholders[meatCarrierAccount].profession == 4) && (stakeholders[brandAccount].profession == 5))
          
            businessList[businessID++] = Business(foodProviderAccount, breederAccount, pigCarrierAccount, 
                            slaughterHouseAccount, meatCarrierAccount, brandAccount);
    }
    
    /* Reputate a stakeholder (evaluated) for a business with a score from 0 to 3. */
    function reputate(uint businessID, address evaluatedAccount, uint score) {
        address evaluatorAccount = msg.sender;
        Stakeholder evaluator = stakeholders[evaluatorAccount];
        Stakeholder evaluated = stakeholders[evaluatedAccount];
        
        if (canReputate(businessID, evaluator, evaluated)) {
            Evaluation evaluation = Evaluation(getReputation(evaluatorAccount), score);
            evalutions[evaluatedAccount].add(evaluation);
        }
    }
    
    /* Check if the evaluator can reputate the evaluated for the business */ 
    function canReputation(uint businessID, address evaluatorAccount, address evaluatedAccount) constant returns (bool result) {
        // check if these stakeholder are in this business
        
        // check if the evaluator has not already reputated the evaluated
        
        // check if evaluator can evaluate the evaluated regarding to the relation rules
        
        // if all are true return true, false otherwise.
    }
    
    /* Calculate and return the reputation value for the given stakeholder. */
    function getReputation(address stakeholderAccount) constant returns (uint reputation) {
        uint totalWeight = 0;
        uint totalWeightedScore = 0;
        Evaluation[] evaluationList = evaluations[stakeholderAccount];
        
        for (int i=0; i<evaluationList.size-1; i++) {
            Evaluation evaluation = evaluationList[i];
            totalWeight += evaluation.weight;
            totalWeightedScore += evaluation.weight * evaluation.score;
        }
        
        return round(totalWeightedScore/totalWeight);
    }
}
