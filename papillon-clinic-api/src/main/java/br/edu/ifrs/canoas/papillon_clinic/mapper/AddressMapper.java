package br.edu.ifrs.canoas.papillon_clinic.mapper;


import br.edu.ifrs.canoas.papillon_clinic.domain.address.Address;
import br.edu.ifrs.canoas.papillon_clinic.domain.address.AddressDTO;

public class AddressMapper {
    public static Address fromDtoToEntity(AddressDTO dto){
        Address address = new Address();
        address.setCity(dto.city());
        address.setNumber(dto.number());
        address.setNeighborhood(dto.neighborhood());
        address.setComplement(dto.complement());
        address.setStreet(dto.street());
        return address;
    }

    public static AddressDTO fromEntityToDto(Address address){
        return new AddressDTO(address.getStreet(), address.getNumber(), address.getCity(), address.getNeighborhood(), address.getComplement());
    }
}
