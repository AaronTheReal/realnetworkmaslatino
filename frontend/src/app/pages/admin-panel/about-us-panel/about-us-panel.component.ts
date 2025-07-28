import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { TeamService, TeamMember } from '../../../services/team-service';

interface TeamForm {
  name: FormControl<string>;
  position: FormControl<string>;
  imageUrl: FormControl<string>;
  order: FormControl<number>;
}

@Component({
  selector: 'app-about-us-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DragDropModule],
  templateUrl: './about-us-panel.html',
  styleUrls: ['./about-us-panel.css']
})
export class AboutUsPanelComponent implements OnInit {
  teamMembers: TeamMember[] = [];
  loading = false;
  submitting = false;
  editingId: string | null = null;

  form: FormGroup<TeamForm>;

  constructor(private teamService: TeamService, private fb: FormBuilder) {
    this.form = this.fb.group({
      name: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(120)] }),
      position: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(160)] }),
      imageUrl: this.fb.control('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^(https?:\/\/).+/i)] }),
      order: this.fb.control(0, { nonNullable: true })
    });
  }

  ngOnInit(): void {
    this.fetchMembers();
  }

  fetchMembers(): void {
    this.loading = true;
    this.teamService.getAll().subscribe({
      next: (members) => {
        this.teamMembers = [...members].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando miembros:', err);
        this.loading = false;
      }
    });
  }

  submit(): void {
  if (this.form.invalid) {
    this.form.markAllAsTouched();
    return;
  }

  const payload: TeamMember = {
    name: this.form.value.name!,
    position: this.form.value.position!,
    imageUrl: this.form.value.imageUrl!,
    order: this.form.value.order ?? 0,
  };

  this.submitting = true;

  if (this.editingId) {
    this.teamService.update(this.editingId, payload).subscribe({
      next: (updated) => {
        const idx = this.teamMembers.findIndex(m => m._id === updated._id);
        if (idx > -1) this.teamMembers[idx] = updated;
        this.teamMembers = [...this.teamMembers].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        this.resetForm();
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error actualizando miembro:', err);
        this.submitting = false;
      }
    });
  } else {
    this.teamService.create(payload).subscribe({
      next: (created) => {
        this.teamMembers = [...this.teamMembers, created].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        this.resetForm();
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error creando miembro:', err);
        this.submitting = false;
      }
    });
  }
}

  onEdit(member: TeamMember): void {
    this.editingId = member._id ?? null;
    this.form.patchValue({
      name: member.name,
      position: member.position,
      imageUrl: member.imageUrl,
      order: member.order ?? 0,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(member: TeamMember): void {
    if (!member._id) return;
    const ok = confirm(`¿Eliminar a ${member.name}? Esta acción no se puede deshacer.`);
    if (!ok) return;

    this.teamService.delete(member._id).subscribe({
      next: () => {
        this.teamMembers = this.teamMembers.filter(m => m._id !== member._id);
      },
      error: (err) => console.error('Error eliminando miembro:', err)
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({ order: 0 });
  }

  drop(event: CdkDragDrop<TeamMember[]>): void {
    moveItemInArray(this.teamMembers, event.previousIndex, event.currentIndex);

    const mapped = this.teamMembers.map((m, index) => ({ ...m, order: index }));
    this.teamMembers = mapped;

    const items = mapped
      .filter(m => !!m._id)
      .map(m => ({ id: m._id as string, order: m.order ?? 0 }));

    this.teamService.reorder(items).subscribe({
      next: () => {},
      error: (err) => console.error('Error reordenando:', err)
    });
  }

  trackById(_index: number, item: TeamMember): string | undefined {
    return item._id;
  }
}
