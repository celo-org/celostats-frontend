import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNodesComponent } from './nodes.component';

describe('NodesComponent', () => {
  let component: DashboardNodesComponent;
  let fixture: ComponentFixture<DashboardNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardNodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
