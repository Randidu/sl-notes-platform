import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Calendar, FileText } from 'lucide-react';
import type { Note } from '../../types';
import Card, { CardBody } from '../ui/Card';

interface NoteCardProps {
    note: Note;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
    const formattedDate = new Date(note.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Link to={`/notes/${note.id}`}>
            <Card hover className="h-full group">
                <CardBody className="flex flex-col h-full">
                    {/* Topic Badge */}
                    {note.topic && (
                        <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-medium rounded-full mb-3 w-fit group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                            {note.topic}
                        </span>
                    )}

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {note.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                        {note.content.substring(0, 150)}...
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-slate-700">
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{note.view_count}</span>
                        </div>
                        {note.file_url && (
                            <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                <FileText className="w-4 h-4" />
                                <span>PDF</span>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </Link>
    );
};

export default NoteCard;
