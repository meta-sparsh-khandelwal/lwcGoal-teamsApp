import { LightningElement } from 'lwc';

export default class Teams extends LightningElement {
    newMemberHandler(event) {
        this.template.querySelector("c-team-list").newMember = JSON.parse(event.detail);
        this.template.querySelector("c-team-list").addNewTeamMember();
    }
}