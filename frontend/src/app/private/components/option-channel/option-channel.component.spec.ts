import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionChannelComponent } from './option-channel.component';

describe('OptionChannelComponent', () => {
  let component: OptionChannelComponent;
  let fixture: ComponentFixture<OptionChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OptionChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
