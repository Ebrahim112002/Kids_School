import React, { useState } from 'react';

const Curriculumn = () => {
  const [showMoreKinder, setShowMoreKinder] = useState(false);
  const [showMoreElementary, setShowMoreElementary] = useState(false);
  const [showMoreMiddle, setShowMoreMiddle] = useState(false);

  return (
    <section className="w-full bg-cover bg-center text-2xl py-20 px-4 text-center flex flex-col items-center justify-center">
      <h2 className="text-[46px] font-bold leading-[58px] mb-28">Standard Curriculum</h2>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full max-w-7xl px-4">
        {/* Card 1 */}
        <div className="rounded-[18.86px] shadow-lg border bg-gradient-to-b from-[#DEF5FF] via-[#DEF5FF]/70 to-white p-6 flex flex-col justify-between transition-all duration-300">
          <div>
            <img src="https://i.ibb.co.com/xSzBvdsL/kinder.png" alt="Kinder" className="mx-auto" />
            <h3 className="mt-10 text-[24.52px] font-bold leading-[30.65px] mb-6 text-[#202020]">
              Kinder (3-6 Years)
            </h3>
            <p className="text-[#808080] font-[Raleway] text-[15.09px] leading-[28.3px] mb-6 min-h-[170px]">
              A playful and nurturing environment that fosters early development through creative activities,
              storytelling, and social learning.
              {showMoreKinder && (
                <>
                  <br />
                  The Kinder program focuses on foundational skills such as language development, motor skills,
                  emotional growth, and socialization. Children engage in imaginative play, creative art activities,
                  and group learning experiences that promote collaboration and confidence-building.
                </>
              )}
            </p>
          </div>
          <button
            className="text-[#64C8FF] font-[Quicksand] text-[15.09px] font-bold bg-white border-none"
            onClick={() => setShowMoreKinder(!showMoreKinder)}
            aria-expanded={showMoreKinder}
          >
            {showMoreKinder ? 'Show Less' : 'Read More'}
          </button>
        </div>

        {/* Card 2 */}
        <div className="rounded-[18.86px] shadow-lg border bg-gradient-to-b from-[#FFF4DC] via-[#FFF4DC]/70 to-white p-6 flex flex-col justify-between transition-all duration-300">
          <div>
            <img src="https://i.ibb.co.com/vCkkJ2n4/elementary.png" alt="Elementary" className="mx-auto" />
            <h3 className="mt-10 text-[24.52px] font-bold leading-[30.65px] mb-6 text-[#202020]">
              Elementary School
            </h3>
            <p className="text-[#808080] font-[Raleway] text-[15.09px] leading-[28.3px] mb-6 min-h-[170px]">
              A balanced curriculum designed to build strong academic foundations in reading, math, science,
              and the arts, while encouraging curiosity.
              {showMoreElementary && (
                <>
                  <br />
                  The Elementary program introduces more structured learning, with an emphasis on literacy, numeracy,
                  and basic science concepts. Students are encouraged to explore the world through project-based
                  learning and hands-on activities, fostering a love for discovery and critical thinking.
                </>
              )}
            </p>
          </div>
          <button
            className="text-[#F0AA00] font-[Quicksand] text-[15.09px] font-bold bg-white border-none"
            onClick={() => setShowMoreElementary(!showMoreElementary)}
            aria-expanded={showMoreElementary}
          >
            {showMoreElementary ? 'Show Less' : 'Read More'}
          </button>
        </div>

        {/* Card 3 */}
        <div className="rounded-[18.86px] shadow-lg border bg-gradient-to-b from-[#EEE1FF] via-[#EEE1FF]/70 to-white p-6 flex flex-col justify-between transition-all duration-300">
          <div>
            <img src="https://i.ibb.co.com/C31dPY7W/middle.png" alt="Middle School" className="mx-auto" />
            <h3 className="mt-10 text-[24.52px] font-bold leading-[30.65px] mb-6 text-[#202020]">
              Middle School (10-16 Years)
            </h3>
            <p className="text-[#808080] font-[Raleway] text-[15.09px] leading-[28.3px] mb-6 min-h-[170px]">
              Focusing on intellectual growth, critical thinking, and character building to prepare students
              for future academic challenges and leadership.
              {showMoreMiddle && (
                <>
                  <br />
                  The Middle School program offers a deeper dive into subjects like history, biology, and technology.
                  Students also work on developing leadership skills, teamwork, and personal responsibility. Specialized
                  electives allow students to explore their interests in areas such as coding, music, or visual arts.
                </>
              )}
            </p>
          </div>
          <button
            className="text-[#8700FF] font-[Quicksand] text-[15.09px] font-bold bg-white border-none"
            onClick={() => setShowMoreMiddle(!showMoreMiddle)}
            aria-expanded={showMoreMiddle}
          >
            {showMoreMiddle ? 'Show Less' : 'Read More'}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Curriculumn;
