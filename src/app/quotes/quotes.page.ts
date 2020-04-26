import { Component, OnInit, ViewChild } from "@angular/core";
import { Quote } from "./quote.module";
import { IonInfiniteScroll } from "@ionic/angular";

@Component({
  selector: "app-quotes",
  templateUrl: "./quotes.page.html",
  styleUrls: ["./quotes.page.scss"],
})
export class QuotesPage implements OnInit {
  page = 0;
  quotes: Quote[] = [];

  constructor() {
    this.loadQuotes();
  }

  loadQuotes() {
    //
  }

  loadMore(e) {
    this.page++;
    this.loadQuotes();
    if (this.page === 3) e.target.disabled = true;
  }

  ngOnInit() {}
}
