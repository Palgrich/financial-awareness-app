import { mockLessons, mockLearningPaths, mockChallenges } from '../../data/mocks';
import { apiDelay, fetchJson } from '../client';
import { USE_MOCK_API } from '../config';
import type { Lesson, LearningPath, Challenge } from '../../types/domain';

function deepCopyLearnDb(): {
  lessons: Lesson[];
  paths: LearningPath[];
  challenges: Challenge[];
} {
  return {
    lessons: JSON.parse(JSON.stringify(mockLessons)),
    paths: JSON.parse(JSON.stringify(mockLearningPaths)),
    challenges: JSON.parse(JSON.stringify(mockChallenges)),
  };
}

let learnDb = deepCopyLearnDb();

export function resetLearnDb(): void {
  learnDb = deepCopyLearnDb();
}

export interface LearnData {
  lessons: Lesson[];
  paths: LearningPath[];
  challenges: Challenge[];
}

export const getLearnData = async (): Promise<LearnData> => {
  if (USE_MOCK_API) {
    await apiDelay(300);
    return {
      lessons: [...learnDb.lessons],
      paths: [...learnDb.paths],
      challenges: [...learnDb.challenges],
    };
  }
  return fetchJson<LearnData>('/learn');
};

export const markLessonCompleted = async (lessonId: string): Promise<void> => {
  if (USE_MOCK_API) {
    await apiDelay(250);
    const lesson = learnDb.lessons.find((l) => l.id === lessonId);
    if (!lesson) return;
    lesson.status = 'done';
    lesson.lastStartedAt = new Date().toISOString();
    return;
  }
  await fetchJson<void>(`/learn/lessons/${encodeURIComponent(lessonId)}/complete`, {
    method: 'POST',
  });
};
