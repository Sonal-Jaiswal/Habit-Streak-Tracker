import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HabitListComponent } from './habit-list.component';
import { CalendarHeatmapComponent } from './calendar-heatmap.component';
import { AppRoutingModule } from './app-routing.module';
import { HabitService } from './habit.service';

@NgModule({
  declarations: [AppComponent, HabitListComponent, CalendarHeatmapComponent],
  imports: [BrowserModule, FormsModule, HttpClientModule, AppRoutingModule],
  providers: [HabitService],
  bootstrap: [AppComponent]
})
export class AppModule {}
