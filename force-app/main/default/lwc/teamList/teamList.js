import { LightningElement, api, track, wire } from 'lwc';
import getAllTeamMembers from '@salesforce/apex/TeamsAppService.getAllTeamMembers';
import getTeamNames from '@salesforce/apex/TeamsAppService.getTeamNames';

export default class TeamList extends LightningElement {
    @track teamMembers=[];
    @track teamMembersToDisplay;
    @api newMember = undefined;
    hasTeamMembers = false;
    teamOptions;
    teamFilter=undefined;
    @api addNewTeamMember() {
        this.teamMembers.push(this.newMember);
        this.teamFilter = undefined;
        this.teamMembersToDisplay = undefined;
    }
    @wire(getTeamNames)
    wiredTeamOptions({ data, error }) {
        if (data) {
            this.teamOptions = data.map((name) => {
                return { label: name, value: name };
            });
        }
        else if (error) {
            console.log(error);
        }
    }
    connectedCallback() {
        getAllTeamMembers()
            .then((data) => {
                this.teamMembers = data;
                this.teamMembersToDisplay = undefined;
                console.log(this.teamMembers);
            })
            .catch(error => {
                console.log(error);
            });
    }
    handleTeamFilter(event) {
        console.log('Changed Filter::::::::::::::::::::::::!!!!!!');
        this.teamFilter = event.detail.value;
        if(this.teamFilter) {
            this.teamMembersToDisplay = this.teamMembers.filter( (element) => {
                return element.Team__r.Name == this.teamFilter;
            });
            if(this.teamMembersToDisplay.length > 0)
                this.hasTeamMembers = true;
            else
                this.hasTeamMembers = false;
        }
    }
}