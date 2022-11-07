import { createElement } from 'lwc';
import Teams from 'c/teams';

describe('c-teams', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });
    async function flushPromises() {
        return Promise.resolve();
    }
    it('Renders child components', async()=> {
        const element = createElement('c-teams', {
            is: Teams
        });
        document.body.appendChild(element);
        const memberSkills = element.shadowRoot.querySelectorAll('c-member-skills');
        const teamList = element.shadowRoot.querySelectorAll('c-team-list');
        await flushPromises();
        expect(memberSkills.length).toBe(1);
        expect(teamList.length).toBe(1);
    });
    it('Calls newMemberHandler on member submit event', async()=> {
        const element = createElement('c-teams', {
            is: Teams
        });
        document.body.appendChild(element);
        const TEAM_MEMBER = {
            Id: "a085i000007gy3lAAA",
            Name: "JestTestName",
            Team__c: "a075i000000ZxvAAAS",
            Skills__c: "Jest, LWC",
            Team__r:
                { Name: "JestTestTeam", Id: "a075i000000ZxvAAAS" }
        };
        const memberSkills = element.shadowRoot.querySelector('c-member-skills');
        const teamList = element.shadowRoot.querySelector('c-team-list');
        teamList.newMember = undefined;
        const newMemberHandler = jest.fn();
        memberSkills.addEventListener('membersubmit', newMemberHandler);
        memberSkills.dispatchEvent(new CustomEvent('membersubmit', {detail: JSON.stringify(TEAM_MEMBER)}));
        await flushPromises();
        expect(newMemberHandler).toHaveBeenCalled();
    });
});