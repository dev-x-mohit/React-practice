import React from 'react';
import {
  RotateCcw,
  Trash2,
  Play,
  Bookmark,
  BookmarkX,
  Clock,
  Inbox
} from 'lucide-react';
import { useAcademy } from '../../context/AcademyContext';
import { getLessonById } from '../../data/curriculum/index';

export function ReviewQueueView() {
  const {
    progress,
    selectLesson,
    removeFromReviewQueue,
    toggleBookmark
  } = useAcademy();

  const reviewItems = progress.reviewQueue.map(item => ({
    ...item,
    lesson: getLessonById(item.lessonId)
  })).filter(i => Boolean(i.lesson));

  const bookmarkedItems = progress.bookmarks.map(id => getLessonById(id)).filter(Boolean);

  return (
    <div className="review-queue-container">
      {/* Header */}
      <section className="review-header">
        <div className="hero-badge">
          <RotateCcw size={16} />
          <span>Active Recall & Spaced Repetition</span>
        </div>
        <h1 className="page-title">Personalized Review Queue</h1>
        <p className="page-subtitle">
          Reinforce weak spots identified by failed tests and revisit your bookmarked lessons to lock concepts into long-term memory.
        </p>
      </section>

      {/* Review Queue Grid */}
      <section className="review-section">
        <div className="section-header-row">
          <h2 className="section-title">Weak Spots & Reinforcement Queue ({reviewItems.length})</h2>
        </div>

        {reviewItems.length === 0 ? (
          <div className="empty-review-box">
            <Inbox size={40} className="text-muted" />
            <h3>Your Review Queue is Empty!</h3>
            <p>Great job! Whenever a practice test assertion fails, the lesson will be queued here for reinforcement.</p>
          </div>
        ) : (
          <div className="review-cards-grid">
            {reviewItems.map(item => (
              <div key={item.lessonId} className="review-card">
                <div className="review-card-top">
                  <span className="phase-pill">{item.lesson.phaseTitle}</span>
                  <button
                    className="icon-btn-danger"
                    title="Remove from review queue"
                    onClick={() => removeFromReviewQueue(item.lessonId)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="review-card-title">{item.lesson.title}</h3>
                <p className="review-reason">
                  <strong>Trigger:</strong> {item.reason}
                </p>

                <div className="review-card-footer">
                  <div className="meta-tags">
                    <span className={`difficulty-badge ${item.lesson.difficulty.toLowerCase()}`}>
                      {item.lesson.difficulty}
                    </span>
                    <span className="duration-tag">
                      <Clock size={12} />
                      {item.lesson.estimatedDuration}
                    </span>
                  </div>

                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => selectLesson(item.lessonId)}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Practice Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Bookmarked Lessons Section */}
      <section className="review-section mt-5">
        <div className="section-header-row">
          <h2 className="section-title">Bookmarked Lessons ({bookmarkedItems.length})</h2>
        </div>

        {bookmarkedItems.length === 0 ? (
          <div className="empty-review-box">
            <Bookmark size={40} className="text-muted" />
            <h3>No Bookmarked Lessons</h3>
            <p>Click the bookmark icon on any lesson to save it here for fast reference.</p>
          </div>
        ) : (
          <div className="review-cards-grid">
            {bookmarkedItems.map(lesson => (
              <div key={lesson.id} className="review-card">
                <div className="review-card-top">
                  <span className="phase-pill">{lesson.phaseTitle}</span>
                  <button
                    className="icon-btn-danger"
                    title="Remove Bookmark"
                    onClick={() => toggleBookmark(lesson.id)}
                  >
                    <BookmarkX size={16} />
                  </button>
                </div>

                <h3 className="review-card-title">{lesson.title}</h3>
                <p className="review-snippet">{lesson.explanation.slice(0, 120)}...</p>

                <div className="review-card-footer">
                  <span className={`difficulty-badge ${lesson.difficulty.toLowerCase()}`}>
                    {lesson.difficulty}
                  </span>
                  <button
                    className="btn btn-outline btn-small"
                    onClick={() => selectLesson(lesson.id)}
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Launch</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
