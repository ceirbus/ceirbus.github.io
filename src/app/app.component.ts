import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { MatSort, MatSortable } from '@angular/material/sort';


interface Book {
  id: '';
  author: '';
  title: '';
  genre: '';
  price: 0;
  description: '';
  publishDate: '';
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public bookDataSource = undefined;
  public books: Book[] = [];
  public bookTableHeaders: string[] = [
    'author', 'title', 'genre', 'price', 'publishDate', 'description', 'delete'
  ];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
    ) {
  }

  public ngOnInit() {
    this.getAll()
      .subscribe((v) => {
        this.setTableData(v);
      });
  }

  public reset() {
    this.http.get<Book[]>(`https://booksapi.azurewebsites.net/api/Books/Reset`)
      .subscribe((v) => {
        this.setTableData(v);
      });
  }

  public sortData(sort: MatSort) {
    this.bookDataSource.sort = this.sort;
  }

  public applyFilter(value: string) {
    this.bookDataSource.filter = value.trim().toLowerCase();
  }

  private getAll(): Observable<Book[]> {
     return this.http
      .get<Book[]>('https://booksapi.azurewebsites.net/api/Books');
  }

  private getDescription(id: string) {
    const book = this.books.find((v) => v.id === id);
    this.dialog.open(DialogComponent, Object.assign(new MatDialogConfig(), {
      data: {
          description: book.description,
          title: book.title
        }
      })
    );
  }

  private delete(id: string) {
    this.http.delete<Book[]>(`https://booksapi.azurewebsites.net/api/Books/${id}`)
      .subscribe((v) => {
        this.setTableData(v);
      });
  }

  private setTableData(data: Book[]) {
    this.books = data;
    this.bookDataSource = new MatTableDataSource(data);
  }

}
