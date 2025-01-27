import FireRabbit from "./FireRabbit";

// export both commonjs and es2016 versions
if (typeof module !== "undefined" && module.exports) {
	module.exports = require("./FireRabbit").default;
}
export default FireRabbit;
