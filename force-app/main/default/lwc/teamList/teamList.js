import { LightningElement, api, track, wire } from 'lwc';
import getAllTeamMembers from '@salesforce/apex/TeamsAppService.getAllTeamMembers';
import getTeamNames from '@salesforce/apex/TeamsAppService.getTeamNames';

export default class TeamList extends LightningElement {
    @track teamMembers;
    @track teamMembersToDisplay;
    @api newMember = undefined;
    teamOptions;
    teamFilter=undefined;
    @api addNewTeamMember() {
        console.log('Method called by Parent :) :) New Member:::::::');
        console.log(this.newMember);
        this.teamMembers.push(this.newMember);
        console.log(this.teamMembers);
        this.teamFilter = undefined;
        this.teamMembersToDisplay = this.teamMembers;
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
                console.log(data);
                this.teamMembers = data;
                this.teamMembersToDisplay = this.teamMembers;
            })
            .catch(error => {
                console.log(error);
            });
    }
    handleTeamFilter(event) {
        console.log('Changed Filter::::::::::::::::::::::::!!!!!!');
        this.teamFilter = event.detail.value;
        if(this.teamFilter) {
            console.log(this.teamFilter);
            this.teamMembersToDisplay = this.teamMembers.filter( (element) => {
                return element.Team__r.Name == this.teamFilter;
            });
            console.log(this.teamMembersToDisplay);
        }
    }
}