CREATE TABLE IF NOT EXISTS comments (
  id          TEXT PRIMARY KEY,
  post_slug   TEXT NOT NULL,
  author_name TEXT,
  content     TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS comment_votes (
  comment_id TEXT NOT NULL,
  vote_type  TEXT NOT NULL CHECK(vote_type IN ('up', 'down')),
  FOREIGN KEY (comment_id) REFERENCES comments(id)
);

CREATE TABLE IF NOT EXISTS suggestions (
  id          TEXT PRIMARY KEY,
  post_slug   TEXT NOT NULL,
  author_name TEXT,
  content     TEXT NOT NULL,
  created_at  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS suggestion_votes (
  suggestion_id TEXT NOT NULL,
  vote_type     TEXT NOT NULL CHECK(vote_type IN ('up', 'down')),
  FOREIGN KEY (suggestion_id) REFERENCES suggestions(id)
);

CREATE TABLE IF NOT EXISTS article_reactions (
  post_slug     TEXT NOT NULL,
  reaction_type TEXT NOT NULL CHECK(reaction_type IN ('heart', 'laugh', 'wow', 'cry'))
);

CREATE TABLE IF NOT EXISTS inline_annotations (
  post_slug        TEXT NOT NULL,
  selected_text    TEXT NOT NULL,
  occurrence_index INTEGER NOT NULL DEFAULT 0,
  annotation_type  TEXT NOT NULL CHECK(annotation_type IN ('reaction', 'comment')),
  reaction_type    TEXT,
  content          TEXT,
  author_name      TEXT,
  created_at       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS email_subscribers (
  email TEXT UNIQUE NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_comments_slug        ON comments(post_slug);
CREATE INDEX IF NOT EXISTS idx_comment_votes_id     ON comment_votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_slug     ON suggestions(post_slug);
CREATE INDEX IF NOT EXISTS idx_suggestion_votes_id  ON suggestion_votes(suggestion_id);
CREATE INDEX IF NOT EXISTS idx_reactions_slug       ON article_reactions(post_slug);
CREATE INDEX IF NOT EXISTS idx_annotations_slug     ON inline_annotations(post_slug);
