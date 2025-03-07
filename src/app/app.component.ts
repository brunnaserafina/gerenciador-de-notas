import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsModule } from '@angular/forms';

interface Nota {
  titulo: string;
  data: string;
  descricao: string;
  cor: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [DatePipe],
  imports: [CommonModule, RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [
    trigger('fadeToggle', [
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  filtroNota: string = '';
  NOTAS: Nota[] = [];
  notaEditada: Nota | null = { titulo: '', data: '', descricao: '', cor: '' };
  CORES = ['#FC4B6C', '#FEC90F', '#00C292', '#03C9D7'];
  background_notas = ['#FFE4E9', '#FFF7DB', '#D9F6EF', '#D9F7F9'];
  showNotas = true;
  indexNotaEditada: number = 0;
  animarTextarea: boolean = false;

  constructor(private datePipe: DatePipe) {}

  formatarData(data: string | Date): string {
    return new Date(data)
      .toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
      .replace('.', '');
  }

  ngOnInit() {
    this.carregarNotas();
  }

  salvarNotas() {
    localStorage.setItem('notas', JSON.stringify(this.NOTAS));
  }

  carregarNotas() {
    const notasSalvas = localStorage.getItem('notas');
    if (notasSalvas) {
      this.NOTAS = JSON.parse(notasSalvas);
    } else {
      this.NOTAS = [
        {
          titulo: 'Nota Padrão',
          data: this.formatarData(new Date()),
          descricao: 'Nova nota',
          cor: '#FFE4E9',
        },
      ];
    }
    this.notaEditada = this.NOTAS[0];
  }

  toggleListarNotas() {
    this.showNotas = !this.showNotas;
  }

  adicionarNota() {
    const novaNota: Nota = {
      titulo: 'Nova Nota',
      data: this.formatarData(new Date()),
      descricao: 'Nova nota',
      cor: '#FFE4E9',
    };
    this.NOTAS.push(novaNota);
    this.salvarNotas();
  }

  excluirNota(index: number) {
    const notaRemovida = this.NOTAS[index];
    this.NOTAS.splice(index, 1);
    if (notaRemovida === this.notaEditada) {
      this.notaEditada = null;
    }
    this.salvarNotas();
  }

  get notasFiltradas() {
    return this.NOTAS.filter((nota) => {
      const filtroLower = this.filtroNota.toLowerCase();
      return (
        nota.descricao.toLowerCase().includes(filtroLower) ||
        nota.data.toLowerCase().includes(filtroLower)
      );
    });
  }

  editarNota(index: number) {
    this.indexNotaEditada = index;
    this.notaEditada = this.NOTAS[index];
  }

  updateCorNota(index: number) {
    if (this.notaEditada) {
      this.notaEditada.cor = this.background_notas[index];
      this.salvarNotas();
    }
  }

  updateDescricaoNota() {
    this.salvarNotas();
  }
}
