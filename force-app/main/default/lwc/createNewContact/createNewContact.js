import { LightningElement, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CONTACT_OBJECT from '@salesforce/schema/Contact';

export default class CreateNewContact extends LightningElement {
    @track contactRecord = {};

    handleFieldChange(e) {
        this.contactRecord[e.currentTarget.fieldName] = e.target.value;
    }

    saveForm() {
        console.log('Contact to save => ', JSON.stringify(this.contactRecord));
        createRecord({ apiName: CONTACT_OBJECT.objectApiName, fields: this.contactRecord })
            .then(contact => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Contact Created',
                        message: 'Record Id => ' + contact.id,
                        variant: 'success'
                    })
                );
            })
            .catch((error) => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
    }
}