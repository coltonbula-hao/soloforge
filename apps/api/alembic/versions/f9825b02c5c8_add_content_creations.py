"""add content creations

Revision ID: f9825b02c5c8
Revises: 861f1fa78ca2
Create Date: 2026-04-17 10:45:00.000000+00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f9825b02c5c8'
down_revision: Union[str, None] = '861f1fa78ca2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'content_creations',
        sa.Column('id', sa.String(length=36), nullable=False),
        sa.Column('user_id', sa.String(length=36), nullable=False),
        sa.Column('knowledge_base_id', sa.String(length=36), nullable=True),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('prompt', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_content_creations_knowledge_base_id', 'content_creations', ['knowledge_base_id'], unique=False)
    op.create_index('ix_content_creations_user_id', 'content_creations', ['user_id'], unique=False)
    op.create_foreign_key(None, 'content_creations', 'knowledge_bases', ['knowledge_base_id'], ['id'], ondelete='SET NULL')
    op.create_foreign_key(None, 'content_creations', 'users', ['user_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    op.drop_table('content_creations')
