import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUserChannelComponent } from './add-user-channel.component';

describe('AddUserChannelComponent', () => {
  let component: AddUserChannelComponent;
  let fixture: ComponentFixture<AddUserChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUserChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
