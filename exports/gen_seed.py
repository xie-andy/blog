import csv
import re
import os

def pg_to_iso(ts):
    if not ts:
        return None
    ts = ts.replace(' ', 'T')
    ts = re.sub(r'\+00(:00)?$', 'Z', ts)
    ts = re.sub(r'(\.\d{3})\d+(Z)', r'\1\2', ts)
    return ts

def esc(val, nullable=True):
    if val is None or val == '':
        return 'NULL' if nullable else "''"
    return "'" + val.replace("'", "''") + "'"

base = os.path.dirname(__file__)
lines = []

# comments: id, post_slug, author_name, content, created_at
with open(f'{base}/comments_rows.csv') as f:
    for row in csv.DictReader(f):
        lines.append(
            f"INSERT INTO comments (id, post_slug, author_name, content, created_at) VALUES "
            f"({esc(row['id'], False)}, {esc(row['post_slug'], False)}, {esc(row['author_name'])}, "
            f"{esc(row['content'], False)}, {esc(pg_to_iso(row['created_at']), False)});"
        )

# comment_votes: comment_id, vote_type
with open(f'{base}/comment_votes_rows.csv') as f:
    for row in csv.DictReader(f):
        lines.append(
            f"INSERT INTO comment_votes (comment_id, vote_type) VALUES "
            f"({esc(row['comment_id'], False)}, {esc(row['vote_type'], False)});"
        )

# suggestions: id, post_slug, author_name, content, created_at
with open(f'{base}/suggestions_rows.csv') as f:
    for row in csv.DictReader(f):
        lines.append(
            f"INSERT INTO suggestions (id, post_slug, author_name, content, created_at) VALUES "
            f"({esc(row['id'], False)}, {esc(row['post_slug'], False)}, {esc(row['author_name'])}, "
            f"{esc(row['content'], False)}, {esc(pg_to_iso(row['created_at']), False)});"
        )

# suggestion_votes: suggestion_id, vote_type
with open(f'{base}/suggestion_votes_rows.csv') as f:
    for row in csv.DictReader(f):
        lines.append(
            f"INSERT INTO suggestion_votes (suggestion_id, vote_type) VALUES "
            f"({esc(row['suggestion_id'], False)}, {esc(row['vote_type'], False)});"
        )

# article_reactions: post_slug, reaction_type
with open(f'{base}/article_reactions_rows.csv') as f:
    for row in csv.DictReader(f):
        lines.append(
            f"INSERT INTO article_reactions (post_slug, reaction_type) VALUES "
            f"({esc(row['post_slug'], False)}, {esc(row['reaction_type'], False)});"
        )

# inline_annotations: post_slug, selected_text, occurrence_index, annotation_type, reaction_type, content, author_name, created_at
with open(f'{base}/inline_annotations_rows.csv') as f:
    for row in csv.DictReader(f):
        lines.append(
            f"INSERT INTO inline_annotations (post_slug, selected_text, occurrence_index, annotation_type, reaction_type, content, author_name, created_at) VALUES "
            f"({esc(row['post_slug'], False)}, {esc(row['selected_text'], False)}, "
            f"{row['occurrence_index'] or '0'}, {esc(row['annotation_type'], False)}, "
            f"{esc(row['reaction_type'])}, {esc(row['content'])}, {esc(row['author_name'])}, "
            f"{esc(pg_to_iso(row['created_at']), False)});"
        )

# email_subscribers: email
with open(f'{base}/email_subscribers_rows.csv') as f:
    for row in csv.DictReader(f):
        lines.append(
            f"INSERT INTO email_subscribers (email) VALUES ({esc(row['email'], False)});"
        )

with open(f'{base}/seed.sql', 'w') as f:
    f.write('\n'.join(lines) + '\n')

print(f"Generated {len(lines)} INSERT statements → exports/seed.sql")
