import { CreativeDraft, CreativeProductType } from '../types/creativeTools';

const CREATIVE_DRAFTS_KEY_PREFIX = 'mokarasa_creative_drafts_';

export const creativeStorage = {
  getUserDrafts(userId: string): CreativeDraft[] {
    if (!userId) return [];
    try {
      const data = localStorage.getItem(`${CREATIVE_DRAFTS_KEY_PREFIX}${userId}`);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUserDraft(userId: string, draft: CreativeDraft): CreativeDraft {
    if (!userId) return draft;
    const all = this.getUserDrafts(userId);
    const existingIndex = all.findIndex((d) => d.id === draft.id);

    const updatedDraft: CreativeDraft = {
      ...draft,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      all[existingIndex] = updatedDraft;
    } else {
      all.unshift(updatedDraft);
    }

    try {
      localStorage.setItem(`${CREATIVE_DRAFTS_KEY_PREFIX}${userId}`, JSON.stringify(all));
    } catch (err) {
      console.warn('Failed to save creative draft:', err);
    }

    return updatedDraft;
  },

  deleteUserDraft(userId: string, draftId: string): void {
    if (!userId) return;
    const all = this.getUserDrafts(userId);
    const filtered = all.filter((d) => d.id !== draftId);
    try {
      localStorage.setItem(`${CREATIVE_DRAFTS_KEY_PREFIX}${userId}`, JSON.stringify(filtered));
    } catch (err) {
      console.warn('Failed to delete creative draft:', err);
    }
  },

  createEmptyDraft(userId: string, type: CreativeProductType, title: string): CreativeDraft {
    return {
      id: `draft_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      type,
      title: title || 'مسودة جديدة بدون عنوان',
      targetAudience: 'عام',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
      isArchived: false,
      content: {},
    };
  },

  exportDraftAsText(draft: CreativeDraft): string {
    const lines: string[] = [
      `=============================================`,
      `منصة حسب قلب الله - مساحة الإبداع والخدمة`,
      `العنوان: ${draft.title}`,
      `النوع: ${draft.type}`,
      `تاريخ الإنشاء: ${new Date(draft.createdAt).toLocaleDateString('ar-EG')}`,
      `الفئة المستهدفة: ${draft.targetAudience}`,
      `=============================================\n`,
    ];

    if (draft.type === 'sermon_preparation') {
      lines.push(`الموضوع / الشاهد: ${draft.content.theme || ''} (${draft.content.scripturePassage || ''})`);
      lines.push(`الهدف المركزي: ${draft.content.centralObjective || ''}\n`);
      lines.push(`المقدمة:\n${draft.content.introduction || ''}\n`);
      if (draft.content.outlinePoints && draft.content.outlinePoints.length > 0) {
        lines.push(`عناصر العظة:`);
        draft.content.outlinePoints.forEach((p, i) => {
          lines.push(`${i + 1}. ${p.title} - ${p.scriptureEvidence || ''}\n   ${p.explanation}`);
        });
        lines.push('');
      }
      lines.push(`التطبيق العملي:\n${draft.content.practicalApplication || ''}\n`);
      lines.push(`الخاتمة:\n${draft.content.conclusion || ''}`);
    } else if (draft.type === 'meeting_design') {
      lines.push(`موضوع اللقاء: ${draft.content.targetTheme || ''}`);
      lines.push(`المدة التقديرية: ${draft.content.meetingDurationMinutes || 60} دقيقة`);
      lines.push(`افتتاحية اللقاء: ${draft.content.openingSegment || ''}`);
      lines.push(`فقرة الكلمة: ${draft.content.wordTopic || ''}`);
      lines.push(`النشاط الجماعي والتفاعل: ${draft.content.groupActivity || ''}`);
      lines.push(`ختام الصلاة: ${draft.content.closingPrayerFocus || ''}`);
    } else {
      lines.push(`النص والمحتوى:\n${draft.content.bodyText || ''}\n`);
      if (draft.content.biblicalAnchor) lines.push(`الشاهد الكتابي: ${draft.content.biblicalAnchor}`);
      if (draft.content.patristicReference) lines.push(`المرجع الآبائي: ${draft.content.patristicReference}`);
      if (draft.content.actionableTakeaway) lines.push(`الخطوة العملية: ${draft.content.actionableTakeaway}`);
    }

    return lines.join('\n');
  },
};
