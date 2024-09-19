import Link from 'next/link'

export default function Pricing() {

  return (
    <div className="min-h-screen flex justify-center items-center">
        <div className="">
            <div className="text-center font-semibold">
                <h1 className="text-5xl">
                    <span className="text-primary tracking-wide">Flexible </span>
                    <span>Plans</span>
                </h1>
                <h2 className="text-2xl text-gray-700 mt-4">
                    Find the Perfect Plan for Your Needs
                </h2>
                <p className="pt-6 text-xl text-gray-400 font-normal w-full px-8 md:w-full">
                    Choose a plan that works best for you and<br/> your team.
                </p>
            </div>
            <div className="pt-24 flex flex-row">
                <div className="w-96 p-8 bg-white text-center rounded-3xl pr-16 shadow-xl">
                    <h1 className="text-black font-semibold text-2xl">Basic</h1>
                    <p className="pt-2 tracking-wide">
                        <span className="text-gray-400 align-top">$ </span>
                        <span className="text-3xl font-semibold">10</span>
                        <span className="text-gray-400 font-medium">/ user</span>
                    </p>
                    <div className="pt-8">
                        {/* ... existing feature list ... */}
                        <Link href="#" className="">
                            <p className="w-full py-4 bg-primary mt-8 rounded-xl text-white">
                                <span className="font-medium">
                                    Choose Plan
                                </span>
                                <span className="pl-2 material-icons align-middle text-sm">
                                    east
                                </span>
                            </p>
                        </Link>
                    </div>
                </div>
                <div className="w-80 p-8 bg-gray-900 text-center rounded-3xl text-white border-4 shadow-xl border-white transform scale-125">
                    <h1 className="text-white font-semibold text-2xl">Startup</h1>
                    <p className="pt-2 tracking-wide">
                        <span className="text-gray-400 align-top">$ </span>
                        <span className="text-3xl font-semibold">24</span>
                        <span className="text-gray-400 font-medium">/ user</span>
                    </p>
                    <div className="pt-8">
                        {/* ... existing feature list ... */}
                        <Link href="#" className="">
                            <p className="w-full py-4 bg-primary mt-8 rounded-xl text-white">
                                <span className="font-medium">
                                    Choose Plan
                                </span>
                                <span className="pl-2 material-icons align-middle text-sm">
                                    east
                                </span>
                            </p>
                        </Link>
                    </div>
                    <div className="absolute top-4 right-4">
                        <p className="bg-secondary font-semibold px-4 py-1 rounded-full uppercase text-xs">Popular</p>
                    </div>
                </div>
                <div className="w-96 p-8 bg-white text-center rounded-3xl pl-16 shadow-xl">
                    <h1 className="text-black font-semibold text-2xl">Enterprise</h1>
                    <p className="pt-2 tracking-wide">
                        <span className="text-gray-400 align-top">$ </span>
                        <span className="text-3xl font-semibold">35</span>
                        <span className="text-gray-400 font-medium">/ user</span>
                    </p>
                    <div className="pt-8">
                        {/* ... existing feature list ... */}
                        <Link href="#" className="">
                            <p className="w-full py-4 bg-primary mt-8 rounded-xl text-white">
                                <span className="font-medium">
                                    Choose Plan
                                </span>
                                <span className="pl-2 material-icons align-middle text-sm">
                                    east
                                </span>
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}