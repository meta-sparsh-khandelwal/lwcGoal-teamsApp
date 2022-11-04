public class TeamsAppServiceImpl implements ITeamsAppService{
    @TestVisible
    private static TeamSelector teamSel = new TeamSelector();
    @TestVisible
    private static TeamMemberSelector teamMemberSel = new TeamMemberSelector();
    @TestVisible 
    private static fflib_ISObjectUnitOfWork uow = new fflib_SObjectUnitOfWork(new Schema.SObjectType[] {
        TeamMember__c.SObjectType
    });
    public List<String> getTeamNames() {
        List<String> teamNames = teamSel.getTeamNames();
        if(teamNames.size() > 0)
            return teamNames;
        throw new AuraHandledException('No teams available');
    }
    public List<TeamMember__c> getAllTeamMembers() {
        return teamMemberSel.getAllTeamMembers();
    }
    public TeamMember__c saveTeam(String team) {
        System.debug(team);
        Object teamObject = (Object) JSON.deserializeUntyped(team);
        System.debug(teamObject);
        Map<String, Object> teamObjectMap = (Map<String, Object>) teamObject;
        String name = (String)teamObjectMap.get('name');
        String skills = (String)teamObjectMap.get('skills');
        Id teamId = teamSel.getTeamIdByName((String)teamObjectMap.get('team'));
        if(teamId == null)
            throw new AuraHandledException('Invalid Team Name');
        System.debug(name);
        System.debug(teamObjectMap);
        TeamMember__c newTeamMember = new TeamMember__c(Name=name, Team__c=teamId, Skills__c=skills);
        System.debug(newTeamMember);
        uow.registerNew(newTeamMember);
        uow.commitWork();
        return teamMemberSel.getTeamMemberWithTeam(newTeamMember.Id);
    }
}
