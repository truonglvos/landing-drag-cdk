import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { interval, Subject } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { ISection } from 'src/app/models/section.model';
import { MenuChildAddNew } from 'src/app/constant/left-menu.constant';
import {
  BUTTON_DEFAULT,
  HEADLINE_DEFAULT,
} from 'src/app/constant/element.constant';
import { IWigetButton } from 'src/app/models/wiget-button.model';
import { take } from 'rxjs/operators';

interface ISnap {
  left?: number;
  right?: number;
  center?: number;
}

@Component({
  selector: 'app-builder-editor',
  templateUrl: './builder-editor.component.html',
  styleUrls: ['./builder-editor.component.scss'],
})
export class BuilderEditorComponent implements OnInit, OnDestroy {
  @ViewChild('quickEditor', { static: true }) quickEditor: ElementRef;
  @ViewChild('builderSnapLeft', { static: true }) builderSnapLeft: ElementRef;
  public sectionArray: ISection[] = [];
  public hasSelectedElement: boolean;
  public quickEditorTop = 0;
  public quickEditorLeft = 0;
  public isDrag = true;
  public elementSelected: HTMLElement;
  public sectionSelected: HTMLElement;
  public snapLeft: number[] = [];
  // public TypeElement = TypeElement;
  public MenuChildAddNew = MenuChildAddNew;
  private _selectSelectedId: number | null;
  private _count: number;
  private _selectSelectedIndex: number | null;
  private _subjectOnDestroy: Subject<any> = new Subject();
  private _innerWidth: number;
  @ViewChild('sectionResize') sectionResize: ElementRef;
  constructor(
    private commonService: CommonService,
    private renderer2: Renderer2,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this._count = 10;
    this._innerWidth = window.innerWidth;
    this.hasSelectedElement = false;
    this.snapLeft.push((this._innerWidth - 960) / 2);
    console.log(this.snapLeft);
  }
  ngOnDestroy(): void {
    this._subjectOnDestroy.next();
    this._subjectOnDestroy.complete();
  }
  addNewSection() {
    this.sectionArray.push({
      id: this._count,
      idSection: `SECTION${this._count}`,
      height: 360,
      element: [],
    });
    this._count++;
  }

  setSelectSelected(id: number | null) {
    // if (this._selectSelectedId === id) return;
    // this._selectSelectedId = id;
    // this._selectSelectedIndex = this.sectionArray.findIndex(
    //   (section) => section.id === id
    // );
  }
  setIsDrag(isDrag: boolean) {
    this.isDrag = isDrag;
  }
  setPositionQuickEditor(top: number, left: number) {
    let height = 0;
    let i = 0;
    for (; i < this._selectSelectedIndex; i++) {
      height += this.sectionArray[i].height;
    }
    this.quickEditorTop = top + height;
    this.quickEditorLeft = left;
  }
  setSnapLeft(left: number) {
    let length = this.snapLeft.length;
    let i = 0;
    this.renderer2.setStyle(
      this.builderSnapLeft.nativeElement,
      'left',
      left + 'px'
    );
    for (i; i < length; i++) {
      if (
        // this.snapLeft[i] > left
        //   ? this.snapLeft[i] - left <= 1
        //   : this.snapLeft[i] - left >= -1
        this.snapLeft[i] === left
      ) {
        console.log(this.snapLeft[i]);
        console.log(left);
        this.renderer2.setStyle(
          this.builderSnapLeft.nativeElement,
          'left',
          this.snapLeft[i] + 'px'
        );
        this.renderer2.removeClass(
          this.builderSnapLeft.nativeElement,
          'ladi-hidden'
        );
      } else {
        this.renderer2.addClass(
          this.builderSnapLeft.nativeElement,
          'ladi-hidden'
        );
      }
    }
  }

  /**
   * @author TruongLV
   * @email anhtruonglavm2@gmail.com
   * @create date 2021-05-27 17:54:20
   * @modify date 2021-05-27 17:54:20
   * @desc delete element resize, size
   */

  setElementSelected(ele: HTMLElement) {
    if (this.elementSelected) {
      const ladiResize = this.elementSelected.querySelectorAll('.ladi-resize');
      const ladiSize = this.elementSelected.querySelectorAll('.ladi-size');
      ladiResize.forEach((e) => e.remove());
      ladiSize.forEach((e) => e.remove());
    }
    if (this.sectionSelected) {
      const ladiResize = this.sectionSelected.querySelectorAll('.ladi-resize');
      ladiResize.forEach((e) => e.remove());
      this.setSelectSelected = null;
    }
    this.elementSelected = ele;
  }

  /**
   * @author TruongLV
   * @email anhtruonglavm2@gmail.com
   * @create date 2021-05-27 17:54:20
   * @modify date 2021-05-27 17:54:20
   * @desc set Section clicked
   */

  setSectionSelect(el: HTMLElement) {
    this.sectionSelected = el;
  }
  setHeightSection(height: number) {
    this.sectionArray[this._selectSelectedIndex].height = height;
  }
  setIndexSelect(index) {
    this._selectSelectedIndex = index;
  }

  setHasSelected(isSelected: boolean) {
    this.hasSelectedElement = isSelected;
  }

  addElement(elementType: MenuChildAddNew) {
    console.log(elementType);
    if (this.sectionArray.length === 0) {
      this.addNewSection();
    }
    switch (elementType) {
      case MenuChildAddNew.BUTTON: {
        this.sectionArray[this._selectSelectedIndex | 0].element.push({
          id: this._count,
          idSection: this._selectSelectedIndex | 0,
          height: BUTTON_DEFAULT.HEIGHT,
          width: BUTTON_DEFAULT.WIDTH,
          top:
            (this.sectionArray[this._selectSelectedIndex | 0].height -
              BUTTON_DEFAULT.HEIGHT) /
            2,
          left: (this._innerWidth - BUTTON_DEFAULT.WIDTH) / 2,
          elementType: MenuChildAddNew.BUTTON,
          innerHtml: BUTTON_DEFAULT.INNER_HTML,
        });
        this._count++;
        break;
      }

      case MenuChildAddNew.TITLE: {
        this.sectionArray[this._selectSelectedIndex | 0].element.push({
          id: this._count,
          idSection: this._selectSelectedIndex | 0,
          width: HEADLINE_DEFAULT.WIDTH,
          top:
            (this.sectionArray[this._selectSelectedIndex | 0].height -
              HEADLINE_DEFAULT.HEIGHT) /
            2,
          left: (this._innerWidth - HEADLINE_DEFAULT.WIDTH) / 2,
          elementType: MenuChildAddNew.TITLE,
          innerHtml: HEADLINE_DEFAULT.INNER_HTML,
        });
        this._count++;
        break;
      }
    }
  }

  blur(event, indexElement: number, indexSection: number) {
    (
      this.sectionArray[indexSection].element[indexElement] as IWigetButton
    ).innerHtml = event.target.innerText;
    console.log(this.sectionArray);
  }
}

// kk
// [innerHTML]="itemElement.innerHtml"
// (blur)="blur($event, indexElement, indexSection)"
