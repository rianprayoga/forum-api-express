import { logger } from "./application/logging";
import { web } from "./application/web";

web.listen(8080, ()=> {
    logger.info("running in port 8080")
})