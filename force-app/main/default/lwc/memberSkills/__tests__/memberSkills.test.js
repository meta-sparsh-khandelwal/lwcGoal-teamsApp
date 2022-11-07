import { createElement } from 'lwc';
import MemberSkills from 'c/memberSkills';
import getTeamNames from '@salesforce/apex/TeamsAppService.getTeamNames';
import saveTeam from '@salesforce/apex/TeamsAppService.saveTeam';

const mockGetTeamNames = require('./data/getTeamNames.json');
// method mocks
jest.mock(
    '@salesforce/apex/TeamsAppService.getTeamNames',
    () => {
        const {
            createApexTestWireAdapter
        } = require('@salesforce/sfdx-lwc-jest');
        return {
            default: createApexTestWireAdapter(jest.fn())
        };
    },
    { virtual: true }
);

jest.mock(
    '@salesforce/apex/TeamsAppService.saveTeam',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);
// Sample data for imperative Apex call
const APEX_SAVE_TEAM_SUCCESS =
    {
        Id: "a085i000007gy3lAAA",
        Name: "JestTestName",
        Team__c: "a075i000000ZxvAAAS",
        Skills__c: "Jest, LWC",
        Team__r:
            { Name: "JestTestTeam", Id: "a075i000000ZxvAAAS" }
    }
;

// Sample error for imperative Apex call
const APEX_SAVE_TEAM_ERROR = {
    body: { message: 'Invalid Team Name' },
    ok: false,
    status: 500,
    statusText: 'Server Error'
};

describe('c-member-skills', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });
    async function flushPromises() {
        return Promise.resolve();
    }
    describe('getTeamNames @wire', () => {
        it('renders team names in combobox options when data is returned', async () => {
            const element = createElement('c-member-skills', {
                is: MemberSkills
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getTeamNames.emit(mockGetTeamNames);

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const combobox = element.shadowRoot.querySelector('.dataCombobox');
            let teamOptions = mockGetTeamNames.map((name) => {
                return { label: name, value: name };
            });
            expect(JSON.stringify(combobox.options)).toBe(JSON.stringify(teamOptions));
        });
        it('Renders combobox with disabled attribute', async () => {
            const element = createElement('c-member-skills', {
                is: MemberSkills
            });
            document.body.appendChild(element);

            // Emit data from @wire
            getTeamNames.error();

            // Wait for any asynchronous DOM updates
            await flushPromises();

            // Select elements for validation
            const combobox = element.shadowRoot.querySelector('.errorCombobox');
            expect(combobox.disabled).toBe(true);
        });
    });
    describe('Save Team on submit', () => {
        it('passes the team input to the Apex method correctly and dispatches membersubmit event', async () => {
            const USER_INPUT = { name: 'JestTestName', team: 'JestTestTeam', skills: 'Jest, LWC' };
            const APEX_PARAMETERS = { team: JSON.stringify(USER_INPUT) };
            // Assign mock value for resolved Apex promise
            saveTeam.mockResolvedValue(APEX_SAVE_TEAM_SUCCESS);

            // Create initial element
            const element = createElement('c-member-skills', {
                is: MemberSkills
            });
            document.body.appendChild(element);
            const memberSubmitHandler = jest.fn();
            element.addEventListener('membersubmit', memberSubmitHandler);
            getTeamNames.emit(mockGetTeamNames);
            await flushPromises();

            // Select input fields for simulating user input
            const inputName = element.shadowRoot.querySelector('.inputName');
            const inputTeam = element.shadowRoot.querySelector('.dataCombobox');
            const inputSkills = element.shadowRoot.querySelector('.inputSkills');
            inputName.value = USER_INPUT.name;
            inputName.dispatchEvent(new CustomEvent('change', { detail: { value: USER_INPUT.name } }));
            inputTeam.value = USER_INPUT.team;
            inputTeam.dispatchEvent(new CustomEvent('change', { detail: { value: USER_INPUT.team } }));
            inputSkills.value = USER_INPUT.skills;
            inputSkills.dispatchEvent(new CustomEvent('change', { detail: { value: USER_INPUT.skills } }));

            // Select button for executing Apex call
            const buttonEl = element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();

            await flushPromises();

            // Validate parameters of mocked Apex call
            expect(saveTeam.mock.calls[0][0]).toEqual(APEX_PARAMETERS);
            expect(memberSubmitHandler).toHaveBeenCalled();
        });
        it('renders the error panel when the Apex method returns an error', async () => {
            const USER_INPUT = { name: 'JestTestName', team: 'JestTestTeam', skills: 'Jest, LWC' };
            // Assing mock value for rejected Apex promise
            saveTeam.mockRejectedValue(APEX_SAVE_TEAM_ERROR);
            // Create initial element
            const element = createElement('c-member-skills', {
                is: MemberSkills
            });
            document.body.appendChild(element);

            const memberSubmitHandler = jest.fn();
            element.addEventListener('membersubmit', memberSubmitHandler);
            getTeamNames.emit(mockGetTeamNames);
            await flushPromises();

            // Select input fields for simulating user input
            const inputName = element.shadowRoot.querySelector('.inputName');
            const inputTeam = element.shadowRoot.querySelector('.dataCombobox');
            const inputSkills = element.shadowRoot.querySelector('.inputSkills');
            inputName.value = USER_INPUT.name;
            inputName.dispatchEvent(new CustomEvent('change', { detail: { value: USER_INPUT.name } }));
            inputTeam.value = USER_INPUT.team;
            inputTeam.dispatchEvent(new CustomEvent('change', { detail: { value: USER_INPUT.team } }));
            inputSkills.value = USER_INPUT.skills;
            inputSkills.dispatchEvent(new CustomEvent('change', { detail: { value: USER_INPUT.skills } }));

            // Select button for executing Apex call
            const buttonEl = element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();
            await flushPromises();
            expect(memberSubmitHandler).not.toHaveBeenCalled();
        });
    });
    describe('Show Toast Event', () => {
        it('Show success toast when team member is saved', async () => {
            const USER_INPUT = { name: 'JestTestName', team: 'JestTestTeam', skills: 'Jest, LWC' };
            const TOAST_TITLE = 'TeamMember Registered Successfully';
            const TOAST_MESSAGE = 'Created TeamMember: a085i000007gy3lAAA';
            const TOAST_VARIANT = 'success';
            // Assign mock value for resolved Apex promise
            saveTeam.mockResolvedValue(APEX_SAVE_TEAM_SUCCESS);

            // Create initial element
            const element = createElement('c-member-skills', {
                is: MemberSkills
            });
            document.body.appendChild(element);
            const handler = jest.fn();
            element.addEventListener('lightning__showtoast', handler);
            getTeamNames.emit(mockGetTeamNames);
            await flushPromises();

            // Select input fields for simulating user input
            const inputName = element.shadowRoot.querySelector('.inputName');
            const inputTeam = element.shadowRoot.querySelector('.dataCombobox');
            const inputSkills = element.shadowRoot.querySelector('.inputSkills');
            inputName.value = USER_INPUT.name;
            inputName.dispatchEvent(new CustomEvent('change', { detail: { value: USER_INPUT.name } }));
            inputTeam.value = USER_INPUT.team;
            inputTeam.dispatchEvent(new CustomEvent('change', { detail: { value: USER_INPUT.team } }));
            inputSkills.value = USER_INPUT.skills;
            inputSkills.dispatchEvent(new CustomEvent('change', { detail: { value: USER_INPUT.skills } }));

            // Select button for executing Apex call
            const buttonEl = element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();

            await flushPromises();

            // Validate parameters of mocked Apex call
            // Check if toast event has been fired
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail.title).toBe(TOAST_TITLE);
            expect(handler.mock.calls[0][0].detail.message).toBe(TOAST_MESSAGE);
            expect(handler.mock.calls[0][0].detail.variant).toBe(TOAST_VARIANT);
        });
        it('Show error toast when save team throws error', async () => {
            const USER_INPUT = { name: 'JestTestName', team: 'JestTestTeam', skills: 'Jest, LWC' };
            const TOAST_TITLE = 'Error!!';
            const TOAST_MESSAGE = APEX_SAVE_TEAM_ERROR.body.message + ' error occured';
            const TOAST_VARIANT = 'error';
            // Assign mock value for resolved Apex promise
            saveTeam.mockRejectedValue(APEX_SAVE_TEAM_ERROR);

            // Create initial element
            const element = createElement('c-member-skills', {
                is: MemberSkills
            });
            document.body.appendChild(element);
            const handler = jest.fn();
            element.addEventListener('lightning__showtoast', handler);
            getTeamNames.emit(mockGetTeamNames);
            await flushPromises();

            // Select input fields for simulating user input
            const inputName = element.shadowRoot.querySelector('.inputName');
            const inputTeam = element.shadowRoot.querySelector('.dataCombobox');
            const inputSkills = element.shadowRoot.querySelector('.inputSkills');
            inputName.value = USER_INPUT.name;
            inputName.dispatchEvent(new CustomEvent('change', { detail: { value: USER_INPUT.name } }));
            inputTeam.value = USER_INPUT.team;
            inputTeam.dispatchEvent(new CustomEvent('change', { detail: { value: USER_INPUT.team } }));
            inputSkills.value = USER_INPUT.skills;
            inputSkills.dispatchEvent(new CustomEvent('change', { detail: { value: USER_INPUT.skills } }));

            // Select button for executing Apex call
            const buttonEl = element.shadowRoot.querySelector('lightning-button');
            buttonEl.click();

            await flushPromises();

            // Validate parameters of mocked Apex call
            // Check if toast event has been fired
            expect(handler).toHaveBeenCalled();
            expect(handler.mock.calls[0][0].detail.title).toBe(TOAST_TITLE);
            expect(handler.mock.calls[0][0].detail.message).toBe(TOAST_MESSAGE);
            expect(handler.mock.calls[0][0].detail.variant).toBe(TOAST_VARIANT);
        });
    });
});