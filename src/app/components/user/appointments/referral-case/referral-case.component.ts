import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from 'express';

@Component({
  selector: 'app-referral-case',
  standalone: true,
  imports: [],
  templateUrl: './referral-case.component.html',
  styleUrl: './referral-case.component.scss'
})
export class ReferralCaseComponent implements OnInit{
  
  constructor(
    private route:ActivatedRoute
  ){}
  caseId:any;
  
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('caseID', id)
  }

}
