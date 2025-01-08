import Title from "@/component/shared/Title";
import { HiCheck, HiXMark } from "react-icons/hi2";

const Compare = () => {
  return (
    <section className="section pt-24 md:pt-32 lg:pt-40 pb-24 md:pb-32 lg:pb-40 bg-grey dark:bg-light w-full overflow-hidden">
      <div className="max-w-7xl w-full mx-auto">
        <Title title="Compare" subtitle="Compare with others" />
        <div className="inner">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white dark:bg-dark">
                  <th className="font-semibold text-black dark:text-white py-5 px-2 text-left"></th>
                  <th className="font-semibold text-black dark:text-white py-5 px-2 text-center">
                    Buy your own GPU
                  </th>
                  <th className="font-semibold text-black dark:text-white py-5 px-2 text-center">
                    Rent cloud GPU
                  </th>
                  <th className="font-semibold text-black dark:text-white py-5 px-2 text-center">
                    Subscription service
                  </th>
                  <th className="font-semibold text-black dark:text-white py-5 px-2 text-center">
                    Bashable.art
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-borderlight dark:border-border">
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-left">
                    No Upfront Costs
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiXMark className="inline-block text-xl text-red-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-borderlight dark:border-border">
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-left">
                    No Setup/Install
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiXMark className="inline-block text-xl text-red-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiXMark className="inline-block text-xl text-red-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-borderlight dark:border-border">
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-left">
                    No Cost for Idle Time
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiXMark className="inline-block text-xl text-red-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-borderlight dark:border-border">
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-left">
                    No Expiring Credits
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiXMark className="inline-block text-xl text-red-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                </tr>
                <tr className="border-b border-borderlight dark:border-border">
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-left">
                    No Content Restrictions
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiXMark className="inline-block text-xl text-red-500" />
                  </td>
                  <td className="text-bodylight dark:text-body px-2 py-2.5 text-center">
                    <HiCheck className="inline-block text-xl text-green-500" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Compare;
