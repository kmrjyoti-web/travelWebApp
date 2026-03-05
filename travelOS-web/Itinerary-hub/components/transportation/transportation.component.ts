import { ChangeDetectionStrategy, Component, input, output, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip, TransportDetails, FlightDetails, TrainDetails } from '../../models/itinerary.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-transportation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transportation.component.html',
  styleUrls: ['./transportation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransportationComponent implements OnChanges {
  trip = input.required<Trip>();
  mode = input<'maker' | 'viewer'>('maker');
  tripUpdated = output<Trip>();

  editableTransport = signal<TransportDetails | null>(null);

  // Mock autocomplete data
  airlineSuggestions = ['Delta', 'American Airlines', 'United Airlines', 'Southwest', 'Lufthansa'];
  airportSuggestions = ['JFK', 'LAX', 'LHR', 'CDG', 'HND', 'DXB'];
  
  showAirlineSuggestions = signal(false);
  showAirportSuggestions = signal<{dep: boolean, arr: boolean}>({dep: false, arr: false});


  ngOnChanges(changes: SimpleChanges) {
    if (changes['trip']) {
      this.editableTransport.set(
        this.trip().transportation ? JSON.parse(JSON.stringify(this.trip().transportation)) : null
      );
    }
  }

  notifyUpdate() {
    const currentTrip = this.trip();
    if (currentTrip) {
      const updatedTrip: Trip = {
        ...currentTrip,
        transportation: this.editableTransport() ? JSON.parse(JSON.stringify(this.editableTransport())) : undefined,
      };
      this.tripUpdated.emit(updatedTrip);
    }
  }

  addFlight() {
    const newFlight: FlightDetails = {
      airline: 'New Airline',
      departureAirport: '',
      arrivalAirport: '',
      departureTime: this.trip().preferences.startDate + 'T09:00',
      arrivalTime: this.trip().preferences.startDate + 'T11:00',
      price: 0
    };
    this.editableTransport.update(transport => {
      const newTransport = transport ? JSON.parse(JSON.stringify(transport)) : { flights: [], trains: [] };
      if (!newTransport.flights) {
        newTransport.flights = [];
      }
      newTransport.flights.push(newFlight);
      return newTransport;
    });
    this.notifyUpdate();
  }
  
  removeFlight(index: number) {
      this.editableTransport.update(transport => {
          if (!transport?.flights) return transport;
          const newFlights = [...transport.flights];
          newFlights.splice(index, 1);
          return {...transport, flights: newFlights};
      });
      this.notifyUpdate();
  }

  addTrain() {
      const newTrain: TrainDetails = {
          trainType: 'High-Speed',
          departureStation: '',
          arrivalStation: '',
          departureTime: this.trip().preferences.startDate + 'T14:00',
          arrivalTime: this.trip().preferences.startDate + 'T16:00',
          price: 0
      };
      this.editableTransport.update(transport => {
          const newTransport = transport ? JSON.parse(JSON.stringify(transport)) : { flights: [], trains: [] };
          if (!newTransport.trains) {
              newTransport.trains = [];
          }
          newTransport.trains.push(newTrain);
          return newTransport;
      });
      this.notifyUpdate();
  }

  removeTrain(index: number) {
      this.editableTransport.update(transport => {
          if (!transport?.trains) return transport;
          const newTrains = [...transport.trains];
          newTrains.splice(index, 1);
          return {...transport, trains: newTrains};
      });
      this.notifyUpdate();
  }

  addOtherTransport() {
      const newOther = {
          type: 'Cab',
          details: 'City Transfer',
          price: 0
      };
      this.editableTransport.update(transport => {
          const newTransport = transport ? JSON.parse(JSON.stringify(transport)) : { flights: [], trains: [], other: [] };
          if (!newTransport.other) {
              newTransport.other = [];
          }
          newTransport.other.push(newOther);
          return newTransport;
      });
      this.notifyUpdate();
  }

  removeOtherTransport(index: number) {
      this.editableTransport.update(transport => {
          if (!transport?.other) return transport;
          const newOther = [...transport.other];
          newOther.splice(index, 1);
          return {...transport, other: newOther};
      });
      this.notifyUpdate();
  }

  trackByIndex(index: number, item: any): any {
    return index;
  }
  
  onAirlineChange(name: string, flightIndex: number) {
     this.editableTransport.update(transport => {
        if (transport?.flights?.[flightIndex]) {
            transport.flights[flightIndex].airline = name;
        }
        return transport;
     });
     this.showAirlineSuggestions.set(name.length > 1);
  }

  onAirportChange(name: string, flightIndex: number, type: 'dep' | 'arr') {
     this.editableTransport.update(transport => {
        if (transport?.flights?.[flightIndex]) {
            if (type === 'dep') transport.flights[flightIndex].departureAirport = name;
            else transport.flights[flightIndex].arrivalAirport = name;
        }
        return transport;
     });
     this.showAirportSuggestions.update(s => ({...s, [type]: name.length > 1}));
  }
  
  selectSuggestion(value: string, flightIndex: number, field: 'airline' | 'dep' | 'arr') {
      this.editableTransport.update(transport => {
        if (transport?.flights?.[flightIndex]) {
            if(field === 'airline') transport.flights[flightIndex].airline = value;
            if(field === 'dep') transport.flights[flightIndex].departureAirport = value;
            if(field === 'arr') transport.flights[flightIndex].arrivalAirport = value;
        }
        return transport;
      });
      if(field === 'airline') this.showAirlineSuggestions.set(false);
      if(field === 'dep') this.showAirportSuggestions.update(s => ({...s, dep: false}));
      if(field === 'arr') this.showAirportSuggestions.update(s => ({...s, arr: false}));
      this.notifyUpdate();
  }

  handleAirlineBlur() {
    this.notifyUpdate();
    // Use a small timeout to allow the click event on the suggestion to register before hiding it
    setTimeout(() => {
      this.showAirlineSuggestions.set(false);
    }, 150);
  }

  handleAirportBlur(type: 'dep' | 'arr') {
    this.notifyUpdate();
    // Use a small timeout to allow the click event on the suggestion to register before hiding it
    setTimeout(() => {
      this.showAirportSuggestions.update(s => ({ ...s, [type]: false }));
    }, 150);
  }
}