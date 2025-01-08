import { useEffect, useRef, useState } from "react";

const sequence = [
	"(>_)      ",
	"(>_)      ",
	"(>_)      ",
	"(>_)      ",
	"(-__)     ",
	"(-___)    ",
	"(-____)   ",
	"(-____-)  ",
	"(-_____-) ",
	"(-______-)",
	"(-______-)",
	"(>______<)",
	"(>______<)",
	"(>______<)",
	"(>______<)",
	"(>______<)",
	"(-______-)",
	"(-______-)",
	" (-_____-)",
	"  (-____-)",
	"   (-___-)",
	"    (___-)",
	"     (__-)",
	"      (_<)",
	"      (_<)",
	"      (_<)",
	"      (_<)",
];

let sequenceLength = sequence.length;

const LoaderPlaceholder = () => {
	const direction = useRef("");
	const [current, setCurrent] = useState<number>(0);

	if (current <= 0) {
		direction.current = 'increase';
	}
	if (current >= sequenceLength - 1) {
		direction.current = 'decrease'
	}

	useEffect(() => {
		let interval = setInterval(() => {
			setCurrent((prev) => direction.current === 'increase' ? prev + 1 : prev - 1);
		}, 200);

		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="aspect-square overflow-hidden bg-white dark:bg-dark w-full rounded-lg flex justify-center items-center p-4">
			<h4 className={`text-bodylight font-semibold dark:text-body text-xl inline-block w-[88px] ${current < Math.floor((sequenceLength / 2)) ? "text-left" : "text-right"}`}>
				{sequence[current]}
			</h4>
		</div>
	);
};

export default LoaderPlaceholder;
