import { createElement } from 'lwc';
import TeamList from 'c/teamList';
import getAllTeamMembers from '@salesforce/apex/TeamsAppService.getAllTeamMembers';
import getTeamNames from '@salesforce/apex/TeamsAppService.getTeamNames';

const mockGetTeamNames = require('./data/getTeamNames.json');
const APEX_GET_ALL_TEAM_MEMBERS = require('./data/getAllTeamMembers.json');
const APEX_GET_ALL_TEAM_MEMBERS_NO_DATA = [];
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
    '@salesforce/apex/TeamsAppService.getAllTeamMembers',
    () => {
        return {
            default: jest.fn()
        };
    },
    { virtual: true }
);

describe('c-team-list', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });
    async function flushPromises() {
        return Promise.resolve();
    }
    describe('getTeamNames @wire', () => {
        it('renders team names in combobox options when data is returned', async () => {
            const element = createElement('c-team-list', {
                is: TeamList
            });
            getAllTeamMembers.mockResolvedValue(APEX_GET_ALL_TEAM_MEMBERS);
            await flushPromises();
            document.body.appendChild(element);

            // Emit data from @wire
            getTeamNames.emit(mockGetTeamNames);
            console.log('mock Set!!!');
            // Wait for any asynchronous DOM updates
            await flushPromises();
            // Select elements for validation
            const combobox = element.shadowRoot.querySelector('.filterCombobox');
            let teamOptions = mockGetTeamNames.map((name) => {
                return { label: name, value: name };
            });
            expect(JSON.stringify(combobox.options)).toBe(JSON.stringify(teamOptions));
        });
    });
    describe('getAllTeamMembers connectedCallback imperative', () => {
        it('renders all team members in lightning card when data is returned', async () => {
            const element = createElement('c-team-list', {
                is: TeamList
            });
            getAllTeamMembers.mockResolvedValue(APEX_GET_ALL_TEAM_MEMBERS);

            // Wait for any asynchronous DOM updates
            await flushPromises();
            document.body.appendChild(element);

            // Emit data from @wire
            getTeamNames.emit(mockGetTeamNames);
            await flushPromises();

            // Select elements for validation
            const card = element.shadowRoot.querySelectorAll('lightning-card');
            expect(card.length).toBe(8);
            expect(card[1].firstChild.textContent).toBe("Name: " + APEX_GET_ALL_TEAM_MEMBERS[0].Name);
            expect(card[7].firstChild.textContent).toBe("Name: " + APEX_GET_ALL_TEAM_MEMBERS[6].Name);
        });
        it('renders no team members when no data is returned', async () => {
            const element = createElement('c-team-list', {
                is: TeamList
            });
            getAllTeamMembers.mockResolvedValue(APEX_GET_ALL_TEAM_MEMBERS_NO_DATA);

            // Wait for any asynchronous DOM updates
            await flushPromises();
            document.body.appendChild(element);

            // Emit data from @wire
            getTeamNames.emit(mockGetTeamNames);
            await flushPromises();

            // Select elements for validation
            const para = element.shadowRoot.querySelector('p');
            expect(para.textContent).toBe("No Team Members currently");
        });
    });
    describe('filter changes the displayed team members', () => {
        it('shows team members with filtered team value', async () => {
            const element = createElement('c-team-list', {
                is: TeamList
            });
            getAllTeamMembers.mockResolvedValue(APEX_GET_ALL_TEAM_MEMBERS);

            // Wait for any asynchronous DOM updates
            await flushPromises();
            document.body.appendChild(element);

            // Emit data from @wire
            getTeamNames.emit(mockGetTeamNames);
            await flushPromises();

            // Select elements for validation
            const combobox = element.shadowRoot.querySelector('lightning-combobox');
            combobox.value = 'FF1';
            combobox.dispatchEvent(new CustomEvent('change', { detail: {value: 'FF1'} }));
            await flushPromises();
            const card = element.shadowRoot.querySelectorAll('lightning-card');
            expect(card.length).toBe(3);
        });
        it('renders no team members when team filter has empty team', async () => {
            const element = createElement('c-team-list', {
                is: TeamList
            });
            getAllTeamMembers.mockResolvedValue(APEX_GET_ALL_TEAM_MEMBERS_NO_DATA);

            // Wait for any asynchronous DOM updates
            await flushPromises();
            document.body.appendChild(element);

            // Emit data from @wire
            getTeamNames.emit(mockGetTeamNames);
            await flushPromises();

            // Select elements for validation
            const combobox = element.shadowRoot.querySelector('lightning-combobox');
            combobox.value = 'ErrorValue';
            combobox.dispatchEvent(new CustomEvent('change', { detail: {value: 'ErrorValue'} }));
            await flushPromises();
            const para = element.shadowRoot.querySelector('p');
            expect(para.textContent).toBe('No Team Members currently');
        });
    });
});