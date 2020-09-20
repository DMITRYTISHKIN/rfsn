import { Injectable, ElementRef } from '@angular/core';
import * as html2canvas from 'html2canvas';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HtmlExportService {
  private readonly MARGIN_GAP = 30;
  public isExporting$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  public exportToType(container: ElementRef, element: HTMLAnchorElement, type: string): void {
    this.isExporting$.next(true);
    let base64png: any;

    setTimeout(() => {
      (html2canvas as any)(container.nativeElement).then(canvas => {
        base64png = canvas.toDataURL();
        element.href = base64png;
        element.target = '_blank';
        element.download = 'exportar.' + type;
        element.click();
        this.isExporting$.next(false);
      });
    }, 10);
  }

  public rowRender = (canvases, doc, widthContainer: number) => {
    const docHeight = doc.internal.pageSize.getHeight();
    const docWidth = doc.internal.pageSize.getWidth();

    let lastHeight = 0;

    canvases.forEach(canvas => {
      const height = canvas.height / (canvas.width / docWidth);
      let posY = lastHeight;

      if (lastHeight + height > docHeight) {
        lastHeight = height;
        posY = 0;
        doc.addPage();
      } else {
        lastHeight += height;
      }

      doc.addImage(canvas.toDataURL('image/jpeg'), 'JPEG', 0, posY, docWidth, height);
    });
  }

  public columnRender = (canvases, doc, widthContainer: number) => {
    const docHeight = doc.internal.pageSize.getHeight();
    const docWidth = doc.internal.pageSize.getWidth();

    let lastHeight = 0;
    let lastWidth = 0;
    let posY = 0;
    let posX = lastWidth;

    const widthCanvas = +canvases.style.width.replace('px', '');
    const heightCanvas = +canvases.style.height.replace('px', '');


    const width = widthCanvas / (widthContainer / docWidth);
    const height = heightCanvas / (widthCanvas / width);

    doc.addImage(canvases.toDataURL('image/jpeg'), 'JPEG', posX, posY, width, height);

  }
}
