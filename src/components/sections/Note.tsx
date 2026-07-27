import { InView } from '@/components/ui/InView'
import type { NoteContent } from '@/lib/types'

// Dark qualifier band between Contact and the footer — one centred paragraph in brand pink on
// #292624. Figma: 1440 fill x 186 hug, 48px vertical / 96px horizontal padding, text block 1248 wide.
//
// body-2/xl: New Spirit Condensed (font-sans) w400, 24px / 125%, centred.
export default function Note({ content }: { content: NoteContent }) {
  return (
    <section aria-label="A note on availability" className="w-full bg-[#292624]">
      {/* max-w already IS Figma's 1248 text block (1440 frame minus the 96px side padding) — adding
          px-24 on top of it double-counted the inset. Side padding is just the gutter now. */}
      <InView className="mx-auto max-w-[1248px] px-6 py-8 md:py-12 3xl:max-w-[1400px] 3xl:py-14">
        {/* mobile = body-2/s: New Spirit 400 / 16 / 125% / letter-spacing l / #FF6D6A, centred.
            The authored \n keeps "Get in touch to be considered." on its own line. */}
        <p className="section-text-reveal whitespace-pre-line text-center font-sans text-base font-normal leading-[1.25] tracking-[-0.01em] text-[#FF6D6A] md:text-2xl 3xl:text-[28px]">
          {content.body}
        </p>
      </InView>
    </section>
  )
}
