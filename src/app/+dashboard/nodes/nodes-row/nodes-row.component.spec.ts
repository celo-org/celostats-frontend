import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardNodesRowComponent } from './nodes-row.component';

describe('NodesRowComponent', () => {
  let component: DashboardNodesRowComponent;
  let fixture: ComponentFixture<DashboardNodesRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardNodesRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardNodesRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
