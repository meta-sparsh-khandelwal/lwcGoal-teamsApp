public interface ITeamMemberSelector {
    List<TeamMember__c> getAllTeamMembers();
    List<TeamMember__c> selectById(Set<ID> idSet);
    TeamMember__c getTeamMemberWithTeam(Id recordId);
}
