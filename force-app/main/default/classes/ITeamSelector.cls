public interface ITeamSelector {
    List<String> getTeamNames();
    List<Team__c> selectById(Set<ID> idSet);
    Id getTeamIdByName(String teamName);
}
