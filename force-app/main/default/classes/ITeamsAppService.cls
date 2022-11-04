public interface ITeamsAppService {
    List<String> getTeamNames();
    TeamMember__c saveTeam(String team);
    List<TeamMember__c> getAllTeamMembers();
} 