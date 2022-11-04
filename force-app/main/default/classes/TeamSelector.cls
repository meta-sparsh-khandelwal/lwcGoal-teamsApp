public class TeamSelector extends fflib_SObjectSelector implements ITeamSelector {
    public Schema.SObjectType getSObjectType() {
        return Team__c.sObjectType;
    }
    public List<Schema.SObjectField> getSObjectFieldList() {
        return new List<Schema.SObjectField> {
            Team__c.Id,
            Team__c.Name
            };
    }
    public List<String> getTeamNames() {
        List<String> teamNames = new List<String>();
        for(Team__c team : [SELECT Name FROM Team__c]) {
            teamNames.add(team.Name);
        }
        return teamNames;
    }
    public List<Team__c> selectById(Set<ID> idSet){
        return [SELECT Id, Name FROM Team__c WHERE ID in :idSet];
    }
    public Id getTeamIdByName(String teamName) {
        Team__c team = [SELECT Id FROM Team__c WHERE Name =: teamName];
        return team.Id;
    }
}
