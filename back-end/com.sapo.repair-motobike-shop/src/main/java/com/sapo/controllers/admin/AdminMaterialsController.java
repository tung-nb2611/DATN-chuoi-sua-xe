package com.sapo.controllers.admin;

import com.sapo.config.sercurity.jwt.JwtProvider;
import com.sapo.dto.materials.*;
import com.sapo.entities.Material;
import com.sapo.entities.User;
import com.sapo.services.MaterialService;
import com.sapo.services.UserService;
import lombok.val;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.io.IOException;
import java.util.List;

@RequestMapping("/api/admin/materials")
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ADMIN') or hasRole('FIXER') or hasRole('COORDINATOR') or hasRole('SUPER_ADMIN')")
public class AdminMaterialsController {
    private final MaterialService materialService;
    private final UserService userService;
    private final JwtProvider jwtProvider;
    public AdminMaterialsController(MaterialService materialService, UserService userService, JwtProvider jwtProvider) {
        this.materialService = materialService;
        this.userService = userService;
        this.jwtProvider = jwtProvider;
    }

    public Integer getstoreId(HttpServletRequest request){
        String tokenBearer = request.getHeader("Authorization");
        String[] splits = tokenBearer.split(" ");
        String username = jwtProvider.getUserNameFromJwtToken(splits[1]);
        User user = userService.findUserByUsername(username);

        return user.getStore().getId();
    }

    //API lấy list phụ kiện
    @GetMapping
    public ResponseEntity<List<Material>> listMaterial(@RequestParam String keyword,HttpServletRequest request)
    {
        val store_id = getstoreId(request);
        List<Material> materials = materialService.findAllMaterialUsing(store_id,keyword);
        return ResponseEntity.ok(materials);
    }


    // API Tạo Material
    @PostMapping
    public ResponseEntity<MaterialDTORequest> addMaterial(@Valid @RequestBody MaterialDTORequest material,HttpServletRequest request) throws IOException {
        val store_id = getstoreId(request);
        material.setStore_id(store_id);
        materialService.saveMaterial(material);
        return ResponseEntity.ok(material);
    }


    // API Tìm tất cả Material và phân trang
    @GetMapping("/list")
    public ResponseEntity<MaterialPaginationDTO> listMaterial(@RequestParam int page, @RequestParam int limit, @RequestParam String keyword, @RequestParam int status,HttpServletRequest request){
        val store_id = getstoreId(request);
        MaterialPaginationDTO material = materialService.searchMaterial(store_id,page, limit, keyword, status);
        return ResponseEntity.ok(material);
    }

    //API Tìm Thông tin Material bằng id
    @GetMapping("/{id}")
    public ResponseEntity<Material> findMaterialById(@PathVariable("id") int id){
        Material material = materialService.findMaterialById(id);
        return ResponseEntity.ok(material);
    }

    // API Update Material
    @PutMapping("/{id}")
    public ResponseEntity<MaterialDTOUpdateRequest> updateMaterial(@PathVariable("id") int id, @Valid @RequestBody MaterialDTOUpdateRequest materialDTOUpdateRequest) {
        materialService.updateMaterial(id, materialDTOUpdateRequest);
        return ResponseEntity.ok(materialDTOUpdateRequest);
    }

    //API đổi trạng thái material
    @PutMapping("/{id}/status")
    public ResponseEntity<MaterialDTOResponse> changeStatusMaterial(@PathVariable int id){
        MaterialDTOResponse materialDTOResponse = materialService.changeStatusMaterial(id);
        return ResponseEntity.ok(materialDTOResponse);
    }

    // Xóa material
    @PutMapping("/delete/{id}")
    public ResponseEntity<MaterialDTOResponse> deleteMaterial(@PathVariable("id") int id){
        MaterialDTOResponse materialDTOResponse = materialService.deleteMaterial(id);
        return ResponseEntity.ok(materialDTOResponse);
    }
//    // Xóa  list material
//    @PutMapping("/delete/{ids}")
//    public ResponseEntity<List<MaterialDTOResponse>> deleteListMaterial(@PathVariable("ids") List<Integer> ids){
//        List<MaterialDTOResponse> materialDTOResponse = materialService.deleteListMaterial(ids);
//        return ResponseEntity.ok(materialDTOResponse);
//    }

    @PostMapping("/uploadFile/{id}")
    public ResponseEntity<MultipartFile> uploadFile(@PathVariable("id") int id , @RequestParam("file") MultipartFile file) throws IOException {
        materialService.saveImage(id,file);
        return  ResponseEntity.ok(file);
    }

    // API Tạo Material
    @PostMapping("/receipt")
    public ResponseEntity<Void> addMaterial(@Valid @RequestBody MaterialNewDTO material,HttpServletRequest request){
        val store_id = getstoreId(request);
        material.setStore_id(store_id);
        materialService.saveMaterialInReceipt(material);
        return ResponseEntity.ok().build();
    }

}
