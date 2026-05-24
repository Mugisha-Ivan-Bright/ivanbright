import { MessageSquare, X } from 'lucide-react'

export default function FeedbackOverlay({ onOpenComment }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9997]">
      <div
        className="terminal cursor-pointer hover:border-[#4ade80]/50 transition-all duration-300"
        style={{ maxWidth: 280, boxShadow: '0 4px 24px rgba(0,0,0,0.5)' }}
        onClick={onOpenComment}
      >
        <div className="flex items-center gap-2 px-4 py-3">
          <MessageSquare size={16} className="text-[#4ade80]" />
          <span className="font-mono text-xs text-[#aaa] flex-1">Feedback? Share your thoughts →</span>
        </div>
      </div>
    </div>
  )
}
