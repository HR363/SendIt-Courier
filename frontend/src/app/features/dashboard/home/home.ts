import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf, NgForOf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgIf, NgForOf, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  user: User | null = null;
  currentStep = signal(0);
  showPickupModal = signal(false);
  pickupForm = signal({
    senderName: '',
    senderPhone: '',
    pickupAddress: '',
    parcelDescription: '',
    pickupDate: '',
    specialInstructions: ''
  });
  pickupSuccess = signal(false);
  steps = [
    {
      img: 'assets/drop_parcel.png',
      alt: 'Step 1',
      title: 'Unleash Your',
      highlight: 'Inner Warrior',
      highlightClass: 'blue',
      desc: 'Join the battle and conquer the arena with unmatched skill and strategy.'
    },
    {
      img: 'assets/request_pickup.png',
      alt: 'Step 2',
      title: 'Embark on Your',
      highlight: 'Legendary Journey',
      highlightClass: 'green',
      desc: 'Immerse Yourself in a World Where Legends Clash and Heroes Rise to Glory.'
    },
    {
      img: 'assets/track_parcel.png',
      alt: 'Step 3',
      title: 'Master the',
      highlight: 'Art of Magic',
      highlightClass: 'purple',
      desc: 'Harness powerful spells and enchantments to dominate your foes and change the course of battle.'
    },
    {
      img: 'assets/delivered.png',
      alt: 'Step 4',
      title: 'Rise as the',
      highlight: 'Champion',
      highlightClass: 'pink',
      desc: 'Lead your team to victory with unparalleled strength and unwavering determination.'
    }
  ];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.auth.getProfile().subscribe({
      next: user => this.user = user,
      error: () => this.user = null
    });
    setTimeout(() => this.setupScrollSteps(), 300);
  }

  setupScrollSteps() {
    const section = document.querySelector('.scroll-steps-section');
    if (!section) return;
    const stepsCount = this.steps.length;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      let progress = Math.min(Math.max((vh/2 - rect.top) / (rect.height - vh), 0), 1);
      let idx = Math.floor(progress * stepsCount);
      if (idx >= stepsCount) idx = stepsCount - 1;
      this.currentStep.set(idx);
    };
    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();
  }

  openPickupModal() {
    this.showPickupModal.set(true);
    this.pickupSuccess.set(false);
  }
  closePickupModal() {
    this.showPickupModal.set(false);
    this.resetPickupForm();
  }
  submitPickupRequest() {
    // Simulate a successful request
    setTimeout(() => {
      this.pickupSuccess.set(true);
    }, 700);
  }
  resetPickupForm() {
    this.pickupForm.set({
      senderName: '',
      senderPhone: '',
      pickupAddress: '',
      parcelDescription: '',
      pickupDate: '',
      specialInstructions: ''
    });
  }
}
