public class TeamMemberSelector extends fflib_SObjectSelector implements ITeamMemberSelector {
    public Schema.SObjectType getSObjectType() {
        return TeamMember__c.sObjectType;
    }
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            TeamMember__c.Id,
            TeamMember__c.Name,
            TeamMember__c.Skills__c,
            TeamMember__c.Team__c
            };
    }
    
    public List<TeamMember__c> selectById(Set<ID> idSet){
        return [SELECT Id, Name, Skills__c, Team__c FROM TeamMember__c WHERE Id in :idSet];
    }
    public List<TeamMember__c> getAllTeamMembers() {
        return [SELECT Id, Name, Team__r.Name, Skills__c FROM TeamMember__c];
    }
    public TeamMember__c getTeamMemberWithTeam(Id recordId) {
        TeamMember__c member = [SELECT Id, Name, Team__r.Name, Skills__c FROM TeamMember__c WHERE Id =:recordId LIMIT 1];
        return member;
    }
}
