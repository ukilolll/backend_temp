import db from "../services/database.js"

export async function getAllProduct(req,res) {
    try {
       const strQry = `SELECT p.*,
        (
            SELECT row_to_json(brand_obj)
            FROM (
                SELECT "brandId", "brandName"
                FROM brands
                WHERE "brandId" = p."brandId"
            ) brand_obj
        ) AS brand,
        (
            SELECT row_to_json(pdt_obj)
            FROM (
                SELECT "pdTypeId", "pdTypeName"
                FROM "pdTypes"
                WHERE "pdTypeId" = p."pdTypeId"
            ) pdt_obj
        ) AS pdt
    FROM products p;` 

        const result = await db.query(strQry)
        return res.json(result.rows)
    } catch (err) {
        console.log(err)
        return res.status(500).json({message:err.message})
    }
}

export async function getProductById(req,res) {
    try {
        const result = await db.query({
            text:`SELECT p.*,
            (
                SELECT row_to_json(brand_obj)
                FROM (
                    SELECT "brandId", "brandName"
                    FROM brands
                    WHERE "brandId" = p."brandId"
                ) brand_obj
            ) AS brand,
            (
                SELECT row_to_json(pdt_obj)
                FROM (
                    SELECT "pdTypeId", "pdTypeName"
                    FROM "pdTypes"
                    WHERE "pdTypeId" = p."pdTypeId"
                ) pdt_obj
            ) AS pdt
        FROM products p
        WHERE p."pdId" = $1`,
        values:[req.params.id]
        })
        return res.json(result.rows)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

export async function getSearchProduct(req,res) {
     try {
        const result = await db.query({
            text:`SELECT p.*,
            (
                SELECT row_to_json(brand_obj)
                FROM (
                    SELECT "brandId", "brandName"
                    FROM brands
                    WHERE "brandId" = p."brandId"
                ) brand_obj
            ) AS brand,
            (
                SELECT row_to_json(pdt_obj)
                FROM (
                    SELECT "pdTypeId", "pdTypeName"
                    FROM "pdTypes"
                    WHERE "pdTypeId" = p."pdTypeId"
                ) pdt_obj
            ) AS pdt
        FROM products p
        WHERE (
            p."pdId" ILIKE $1
            OR p."pdName" ILIKE $1
            OR p."pdRemark" ILIKE $1
        )`,
        values:[`%${req.params.id}%`]
        })
        return res.json(result.rows)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

export async function postProduct(req,res){
        console.log('POST /products is request.');
        const bodydata = req.body;
        try {
          if(!bodydata.pdId || !bodydata.pdName){
            return res.status(422).json({message: `ERROR pdId and pdName is required`});
          }
        //   const chkRow = await database.query({
        //     text : `SELECT * FROM products WHERE "pdId" = $1`,
        //     values:[bodydata.pdId]
        //   })
          // if(chkRow.rowCount !=0){
          //   return res.status(409).json({message:`ERROR pdId ${bodydata.pdId} is exists `});
          // }
    
          const result = await db.query({
            text:`  INSERT INTO products ("pdId","pdName","pdPrice","pdRemark","pdTypeId","brandId") 
                    VALUES ($1, $2, $3, $4, $5, $6)`,
            values: [
              req.body.pdId,
              req.body.pdName,
              req.body.pdPrice,
              req.body.pdRemark,
              req.body.pdTypeId,
              req.body.brandId
            ]
          })

          console.log(result)
           
          const datetime = new Date();
          bodydata.createData = datetime.toUTCString();
          return res.status(201).json(bodydata)
          
        } catch (error) {
          return res.status(500).json({message:error.message})
        } 
}

export async function putProduct(req,res) {
    try {
        const body = req.body
        const result = await db.query({
            text:`
            UPDATE "products"
            SET "pdName" = $1,
                "pdPrice" = $2,
                "pdRemark" = $3,
                "pdTypeId" = $4,
                "brandId" = $5
            WHERE "pdId" = $6
            `,
        values:[
            body.pdName,
            body.pdPrice,
            body.pdRemark,
            body.pdTypeId,
            body.brandId,
            req.params.id
        ]
        })

        if(result.rowCount == 0){
            return res.status(404).json({message:`error id ${req.params.id} not found`})
        }

        const datetime = new Date();
        body.updataDate = datetime.toUTCString();
        return res.status(201).json(body)

    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

export async function deleteProduct(req,res) {
    try {
        const body = req.body
        const result = await db.query({
            text:`DELETE FROM "products"
                WHERE "pdId" = $1
            `,
        values:[req.params.id]
        })

        
        if(result.rowCount == 0){
            return res.status(404).json({message:`error id ${req.params.id} not found`})
        }
        return res.status(204).end()

    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

export async function getProductByBrandId(req,res){
    try {
        const result = await db.query({
            text:`SELECT p.*,
                (
                    SELECT row_to_json(pdt_obj)
                    FROM ( SELECT "pdTypeId", "pdTypeName"
                        FROM "pdTypes"
                        WHERE "pdTypeId" = p."pdTypeId") pdt_obj
            ) AS pdt
        FROM products p
        WHERE p."brandId" ILIKE $1`,
            values:[req.params.id]
        })
        return res.json(result.rows)

    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}

export async function getThreeProduct(req,res) {
    try {
       const strQry = `SELECT p.*,
        (
            SELECT row_to_json(brand_obj)
            FROM (
                SELECT "brandId", "brandName"
                FROM brands
                WHERE "brandId" = p."brandId"
            ) brand_obj
        ) AS brand,
        (
            SELECT row_to_json(pdt_obj)
            FROM (
                SELECT "pdTypeId", "pdTypeName"
                FROM "pdTypes"
                WHERE "pdTypeId" = p."pdTypeId"
            ) pdt_obj
        ) AS pdt
    FROM products p ORDER BY "pdId"
    OFFSET 0 LIMIT 3;` 

        const result = await db.query(strQry)
        return res.json(result.rows)
    } catch (err) {
        return res.status(500).json({message:err.message})
    }
}