import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { NewsletterService } from '../newsletter.service';

const ALREADY_SUBSCRIBED = "alreadySubscribed";

@Component({
  selector: 'app-newsletter',
  templateUrl: './newsletter.component.html',
  styleUrls: ['./newsletter.component.css']
})
export class NewsletterComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);

  constructor(private newsletterService: NewsletterService) { }

  ngOnInit(): void {
  }

  
  getErrorMessage() {
    if (this.email.errors?.['required']) {
      return "Email is required";
    } else if (this.email.errors?.['email']) {
      return "Email is in incorrect format";
    } else if (this.email.errors?.[ALREADY_SUBSCRIBED]) {
      return "Email has already been subscribed to the newsletter";
    } else {
      return "";
    }
  }
  isGmail(email: string){
    // check if the last @ symbol includes gmail.com (case-insenstive)     
    var gmailExp = RegExp("(@gmail.com$)", "i")
    var test = gmailExp.test(email)
    return test
  }
  stripPeriods(email: string){
    var expr = RegExp("(.+)(@gmail.com$)", "i")
    // Strip any periods from the email address
    // This will force the email to be saved without periods
    // If in the future we want to allow searching for emails
    // based on what is entered, this may need to be revisited.

    let prefix = email.match(expr)![1].replace("\.", "")
    let suffix = email.match(expr)![2]     
    return prefix + suffix
  }

  subscribe() {
    if (this.email.valid) {
      var email = this.email.value;
      
      if (email) {
        // If this is a gmail address, strip any periods from it.
        if (this.isGmail(email)) {
          email = this.stripPeriods(email)          
        }
        this.newsletterService.subscribe(email)
          .subscribe({
            next: success => 
            {
              if (!success) {                
                this.email.setErrors({[ALREADY_SUBSCRIBED]: true});
                }
              }
            })
      }
    }
  }
}
