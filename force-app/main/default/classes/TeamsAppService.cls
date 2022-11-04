global with sharing class TeamsAppService {

    @AuraEnabled(cacheable=true)
    global static List<String> getTeamNames() {
        return service().getTeamNames();
    }

    @AuraEnabled
    global static TeamMember__c saveTeam(String team) {
        return service().saveTeam(team);
    }

    @AuraEnabled(cacheable=false)
    global static List<TeamMember__c> getAllTeamMembers(){
        return service().getAllTeamMembers();
    }

    private static ITeamsAppService service(){
        return new TeamsAppServiceImpl();
    }
}
