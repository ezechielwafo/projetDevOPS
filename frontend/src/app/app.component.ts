import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserService } from './user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private service = inject(UserService);

  users: User[] = [];
  form: User = { name: '', email: '', role: 'USER' };
  editingId: number | null = null;
  error = '';

  ngOnInit() { this.load(); }

  load() {
    this.service.list().subscribe(u => this.users = u);
  }

  save() {
    this.error = '';
    const request = this.editingId
      ? this.service.update(this.editingId, this.form)
      : this.service.create(this.form);
    request.subscribe({
      next: () => { this.reset(); this.load(); },
      error: e => this.error = e.error?.message ?? 'Erreur serveur'
    });
  }

  edit(u: User) {
    this.editingId = u.id!;
    this.form = { name: u.name, email: u.email, role: u.role };
  }

  remove(u: User) {
    if (confirm(`Supprimer ${u.name} ?`)) {
      this.service.delete(u.id!).subscribe(() => this.load());
    }
  }

  reset() {
    this.editingId = null;
    this.form = { name: '', email: '', role: 'USER' };
  }
}
