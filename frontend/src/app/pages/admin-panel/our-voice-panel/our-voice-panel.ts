// src/app/pages/admin-panel/our-voice-panel/our-voice-panel.component.ts
import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
  FormControl,
  FormArray,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { VoiceService, VoiceMember } from '../../../services/meet-service';

interface SocialsForm {
  instagram: FormControl<string>;
  twitter: FormControl<string>;
  tiktok: FormControl<string>;
  facebook: FormControl<string>;
  youtube: FormControl<string>;
  website: FormControl<string>;
}

interface VoiceForm {
  name: FormControl<string>;
  role: FormControl<string>;
  imageUrl: FormControl<string>;
  bio: FormControl<string>;
  order: FormControl<number>;
  isActive: FormControl<boolean>;
  tags: FormArray<FormControl<string>>;
  socials: FormGroup<SocialsForm>;
}

@Component({
  selector: 'app-our-voice-panel',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, DragDropModule],
  templateUrl: './our-voice-panel.html',
  styleUrls: ['./our-voice-panel.css'],
})
export class OurVoicePanel implements OnInit {
  voices: VoiceMember[] = [];
  loading = false;
  submitting = false;
  editingId: string | null = null;

  form: FormGroup<VoiceForm>;

  constructor(private fb: FormBuilder, private voiceService: VoiceService) {
    this.form = this.fb.group<VoiceForm>({
      name: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(120)],
      }),
      role: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.maxLength(160)],
      }),
      imageUrl: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.pattern(/^(https?:\/\/).*/i)],
      }),
      bio: this.fb.control('', {
        nonNullable: true,
        validators: [Validators.maxLength(2000)],
      }),
      order: this.fb.control(0, {
        nonNullable: true,
        validators: [Validators.min(0)],
      }),
      isActive: this.fb.control(true, { nonNullable: true }),
      tags: this.fb.array<FormControl<string>>([]),
      socials: this.fb.group<SocialsForm>({
        instagram: this.fb.control('', { nonNullable: true }),
        twitter: this.fb.control('', { nonNullable: true }),
        tiktok: this.fb.control('', { nonNullable: true }),
        facebook: this.fb.control('', { nonNullable: true }),
        youtube: this.fb.control('', { nonNullable: true }),
        website: this.fb.control('', { nonNullable: true }),
      }),
    });
  }

  ngOnInit(): void {
    this.fetchVoices();
  }

  // -------- Helpers de formulario --------
  get tags(): FormArray<FormControl<string>> {
    return this.form.controls.tags;
  }

  addTag(value: string): void {
    const tag = value.trim();
    if (!tag) return;
    if (!this.tags.value.includes(tag)) {
      this.tags.push(this.fb.control(tag, { nonNullable: true }));
    }
  }

  removeTag(index: number): void {
    this.tags.removeAt(index);
  }

  // -------- CRUD --------
  fetchVoices(): void {
    this.loading = true;
    this.voiceService.getAll().subscribe({
      next: (list) => {
        this.voices = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando voces:', err);
        this.loading = false;
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: VoiceMember = {
      name: this.form.value.name!,
      role: this.form.value.role!,
      imageUrl: this.form.value.imageUrl || undefined,
      bio: this.form.value.bio || undefined,
      order: this.form.value.order ?? 0,
      isActive: this.form.value.isActive ?? true,
      tags: this.tags.value,
      socials: this.form.value.socials ?? {},
    };

    this.submitting = true;

    if (this.editingId) {
      this.voiceService.update(this.editingId, payload).subscribe({
        next: (updated) => {
          const idx = this.voices.findIndex((v) => v._id === updated._id);
          if (idx > -1) this.voices[idx] = updated;
          this.voices = [...this.voices].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          this.resetForm();
          this.submitting = false;
        },
        error: (err) => {
          console.error('Error actualizando voice member:', err);
          this.submitting = false;
        },
      });
    } else {
      this.voiceService.create(payload).subscribe({
        next: (created) => {
          this.voices = [...this.voices, created].sort(
            (a, b) => (a.order ?? 0) - (b.order ?? 0)
          );
        },
        error: (err) => console.error('Error creando voice member:', err),
        complete: () => {
          this.resetForm();
          this.submitting = false;
        },
      });
    }
  }

  onEdit(member: VoiceMember): void {
    this.editingId = member._id ?? null;

    // Reset tags antes de patchValue
    this.tags.clear();
    (member.tags ?? []).forEach((t) => this.tags.push(this.fb.control(t, { nonNullable: true })));

    this.form.patchValue({
      name: member.name ?? '',
      role: member.role ?? '',
      imageUrl: member.imageUrl ?? '',
      bio: member.bio ?? '',
      order: member.order ?? 0,
      isActive: member.isActive ?? true,
      socials: {
        instagram: member.socials?.instagram ?? '',
        twitter: member.socials?.twitter ?? '',
        tiktok: member.socials?.tiktok ?? '',
        facebook: member.socials?.facebook ?? '',
        youtube: member.socials?.youtube ?? '',
        website: member.socials?.website ?? '',
      },
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onDelete(member: VoiceMember): void {
    if (!member._id) return;
    const ok = confirm(`¿Eliminar a ${member.name}? Esta acción no se puede deshacer.`);
    if (!ok) return;

    this.voiceService.delete(member._id).subscribe({
      next: () => {
        this.voices = this.voices.filter((v) => v._id !== member._id);
      },
      error: (err) => console.error('Error eliminando voice member:', err),
    });
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({
      name: '',
      role: '',
      imageUrl: '',
      bio: '',
      order: 0,
      isActive: true,
      socials: {
        instagram: '',
        twitter: '',
        tiktok: '',
        facebook: '',
        youtube: '',
        website: '',
      },
    });
    this.tags.clear();
  }

  // -------- Reordenamiento Drag & Drop --------
  drop(event: CdkDragDrop<VoiceMember[]>): void {
    moveItemInArray(this.voices, event.previousIndex, event.currentIndex);

    // Recalcular order localmente
    const mapped = this.voices.map((v, index) => ({ ...v, order: index }));
    this.voices = mapped;

    const items = mapped
      .filter((v) => !!v._id)
      .map((v) => ({ id: v._id as string, order: v.order ?? 0 }));

    this.voiceService.reorder(items).subscribe({
      next: () => {},
      error: (err) => console.error('Error reordenando voices:', err),
    });
  }

  trackById(_i: number, item: VoiceMember): string | undefined {
    return item._id;
  }
}
