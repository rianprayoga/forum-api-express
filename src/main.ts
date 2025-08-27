import { logger } from "./application/logging";
import { web } from "./application/web";

web.listen(3000, ()=> {
    logger.info("running in port 3000")
})