import Image from 'next/image'
const AboutPage = () => {
  return (
    <section className="max-w-5xl mx-auto">
      <h1>About Me</h1>
      <hr className="my-[8px]" />
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 relative h-[300px] flex flex-col items-center pt-[20px]">
          <Image src="/avatar.webp" alt="profile" width={200} height={200} className="rounded-full" />
          <p className="font-semibold py-2">Hyunwoo</p>
          <p>Frontend Developer</p>
          <span>Seoul, Korea</span>
        </div>
        <div className="col-span-2 pt-[20px] flex flex-col gap-4">
          <p>
            안녕하세요, 4년차 프론트엔드 개발자 권현우입니다. <br />
            제가 짠 코드로 유용한 서비스,프로그램을 만들수 있다는 매력에 빠져 개발자로 일하고 있습니다.
          </p>
          <div>
            <p className="mb-2">
              현재 ConnectWave, 메이크샵 사업부에서 프론트엔드 개발자로 재직 중이며, 아래와 같은 업무를 담당하고
              있습니다.
            </p>
            <ul className="pl-2">
              <li>디자인시스템 기반 UI공통컴포넌트 라이브러리 개발 및 유지보수 </li>
              <li>Makeshop 입점 쇼핑몰 관리자들이 사용하는 어드민 서비스 개발</li>
            </ul>
          </div>

          <p>
            프론트엔드 개발자로서 UX뿐만 아니라 개발자 경험(Developer Experience)도 중요하게 생각합니다. 코드 작성 시
            확장성, 가독성, 유지보수성을 중점적으로 고려합니다.
          </p>
          <p>
            현재는 잘하는 개발자로 성장하기 위해 지속적으로 학습하고 최대한 다양한 개발경험을 쌓으려 노력하고 있습니다.
          </p>
        </div>
      </div>
    </section>
  )
}
export default AboutPage
