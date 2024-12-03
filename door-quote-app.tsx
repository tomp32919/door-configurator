import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Papa from 'papaparse';

// Constants
const MODELS = [
  'Andalucia 4lt',
  'Andalucia 6lt',
  'Andalucia 8lt',
  'Andalucia 9lt Prairie',
  'Andalucia 1W3H',
  'Miranda 4lt',
  'Miranda 6lt',
  'Miranda 7lt Diamond',
  'Miranda 9lt Prairie',
  'Santa Fe',
  'Highlands',
  'Palermo 3lt',
  'Palermo 6lt',
  'Ventura',
  'Portland',
  'Tacoma',
  'Meridian 4lt',
  'Meridian 9lt',
  'Ridgeland',
  'Savannah 1lt',
  'Savannah Full View'
];

const HANDLESET_OPTIONS = [
  'Emtek Black Square: Active Only',
  'Emtek Black Square: Active & Inactive',
  'Emtek Nickel Square: Active Only',
  'Emtek Nickel Square: Active & Inactive',
  'Emtek Black Scroll: Active Only',
  'Emtek Black Scroll: Active & Inactive',
  'Emtek Nickel Scroll: Active Only',
  'Emtek Nickel Scroll: Active & Inactive',
  'No Handleset'
];

const DENTIL_SHELF_OPTIONS = [
  { value: 'applied', label: 'Applied' },
  { value: 'loose', label: 'Loose' },
  { value: 'none', label: 'No Shelf' }
];

export function DoorConfigurator() {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    company: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    poNumber: '',
    email: ''
  });

  const [doorConfigs, setDoorConfigs] = useState([{
    id: 1,
    model: '',
    size: '',
    glass: '',
    jamb: '',
    hinge: '',
    handle: '',
    swing: '',
    notes: ''
  }]);

  const [config, setConfig] = useState({
    models: MODELS,
    sizesByModel: {},
    glassOptions: [],
    jambSizes: [],
    hingeFinishes: [],
    sillFinishes: [],
    handlePreps: [],
    swings: []
  });

  const [handlesetOptions, setHandlesetOptions] = useState({});
  const [dentilShelfOptions, setDentilShelfOptions] = useState({});
  const [customSpecs, setCustomSpecs] = useState({
    jamb: '',
    handle: ''
  });

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const file = await window.fs.readFile('order entry tool doors.csv', { encoding: 'utf8' });
        const parsed = Papa.parse(file, { header: true, skipEmptyLines: true });
        const data = parsed.data.filter(row => row['Door Model'] || row.Size);
        
        // Process sizes by model
        const modelSizes = {};
        let currentModel = null;
        
        data.forEach(row => {
          if (row['Door Model']?.trim()) {
            currentModel = row['Door Model'].trim();
            if (!modelSizes[currentModel]) {
              modelSizes[currentModel] = [];
            }
          }
          if (row.Size && currentModel) {
            modelSizes[currentModel].push(row.Size.trim());
          }
        });

        setConfig({
          models: MODELS,
          sizesByModel: modelSizes,
          glassOptions: [...new Set(data.filter(row => row['Glass Options']).map(row => row['Glass Options'].trim()))].filter(Boolean),
          jambSizes: [...new Set(data.filter(row => row['Jamb Sizes']).map(row => row['Jamb Sizes'].trim()))].filter(Boolean),
          hingeFinishes: [...new Set(data.filter(row => row['Hinge Finish']).map(row => row['Hinge Finish'].trim()))].filter(Boolean),
          sillFinishes: [...new Set(data.filter(row => row['Sill Finish']).map(row => row['Sill Finish'].trim()))].filter(Boolean),
          handlePreps: [...new Set(data.filter(row => row['Handle Prep']).map(row => row['Handle Prep'].trim()))].filter(Boolean),
          swings: [...new Set(data.filter(row => row.Swing).map(row => row.Swing.trim()))].filter(Boolean)
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading configuration:', error);
        setIsLoading(false);
      }
    };

    loadConfig();
  }, []);

  const updateDoorConfig = (id, field, value) => {
    setDoorConfigs(prev => prev.map(door => 
      door.id === id ? { ...door, [field]: value } : door
    ));
  };

  const addNewDoor = () => {
    setDoorConfigs(prev => [...prev, {
      id: prev.length + 1,
      model: '',
      size: '',
      glass: '',
      jamb: '',
      hinge: '',
      handle: '',
      swing: '',
      notes: ''
    }]);
  };

  const updateHandlesetOption = (doorId, value) => {
    setHandlesetOptions(prev => ({ ...prev, [doorId]: value }));
  };

  const updateDentilShelf = (doorId, value) => {
    setDentilShelfOptions(prev => ({ ...prev, [doorId]: value }));
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {page === 1 ? 'Customer Information' : 'Door Configuration'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {page === 1 ? (
            // Customer Information Form
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({...prev, name: e.target.value}))}
                  placeholder="Full Name"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={customerInfo.company}
                  onChange={(e) => setCustomerInfo(prev => ({...prev, company: e.target.value}))}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <Label>Street Address</Label>
                <Input
                  value={customerInfo.streetAddress}
                  onChange={(e) => setCustomerInfo(prev => ({...prev, streetAddress: e.target.value}))}
                  placeholder="Street Address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City</Label>
                  <Input
                    value={customerInfo.city}
                    onChange={(e) => setCustomerInfo(prev => ({...prev, city: e.target.value}))}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label>State</Label>
                  <Input
                    value={customerInfo.state}
                    onChange={(e) => setCustomerInfo(prev => ({...prev, state: e.target.value}))}
                    placeholder="State"
                  />
                </div>
              </div>
              <div>
                <Label>ZIP Code</Label>
                <Input
                  value={customerInfo.zipCode}
                  onChange={(e) => setCustomerInfo(prev => ({...prev, zipCode: e.target.value}))}
                  placeholder="ZIP Code"
                />
              </div>
              <div>
                <Label>PO Number</Label>
                <Input
                  value={customerInfo.poNumber}
                  onChange={(e) => setCustomerInfo(prev => ({...prev, poNumber: e.target.value}))}
                  placeholder="Purchase Order Number"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo(prev => ({...prev, email: e.target.value}))}
                  placeholder="Email Address"
                />
              </div>
              <Button 
                className="w-full mt-6"
                onClick={() => setPage(2)}
                disabled={!Object.values(customerInfo).every(Boolean)}
              >
                Next: Door Configuration
              </Button>
            </div>
          ) : (
            // Door Configuration Form
            <div className="space-y-6">
              <div className="bg-gray-100 p-4 rounded">
                <p><span className="font-medium">Company:</span> {customerInfo.company}</p>
                <p><span className="font-medium">PO Number:</span> {customerInfo.poNumber}</p>
              </div>
              
              {doorConfigs.map((door) => (
                <div key={door.id} className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Door {door.id}</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Model</Label>
                      <Select
                        value={door.model}
                        onValueChange={(value) => updateDoorConfig(door.id, 'model', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Model" />
                        </SelectTrigger>
                        <SelectContent>
                          {MODELS.map((model) => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {door.model && (
                      <div>
                        <Label>Size</Label>
                        <Select
                          value={door.size}
                          onValueChange={(value) => updateDoorConfig(door.id, 'size', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Size" />
                          </SelectTrigger>
                          <SelectContent>
                            {config.sizesByModel[door.model]?.map((size) => (
                              <SelectItem key={size} value={size}>{size}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {door.model && door.size && (
                      <>
                        <div>
                          <Label>Glass Options</Label>
                          <Select
                            value={door.glass}
                            onValueChange={(value) => updateDoorConfig(door.id, 'glass', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Glass Option" />
                            </SelectTrigger>
                            <SelectContent>
                              {config.glassOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Jamb Size</Label>
                          <Select
                            value={door.jamb}
                            onValueChange={(value) => updateDoorConfig(door.id, 'jamb', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Jamb Size" />
                            </SelectTrigger>
                            <SelectContent>
                              {config.jambSizes.map((size) => (
                                <SelectItem key={size} value={size}>{size}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {door.jamb === 'Other (Please Specify)' && (
                            <Input
                              placeholder="Enter custom jamb size"
                              value={customSpecs.jamb}
                              onChange={(e) => setCustomSpecs(prev => ({...prev, jamb: e.target.value}))}
                            />
                          )}
                        </div>

                        <div>
                          <Label>Hinge Finish</Label>
                          <Select
                            value={door.hinge}
                            onValueChange={(value) => updateDoorConfig(door.id, 'hinge', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Hinge Finish" />
                            </SelectTrigger>
                            <SelectContent>
                              {config.hingeFinishes.map((finish) => (
                                <SelectItem key={finish} value={finish}>{finish}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Sill Finish</Label>
                          <Select
                            value={door.sill}
                            onValueChange={(value) => updateDoorConfig(door.id, 'sill', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Sill Finish" />
                            </SelectTrigger>
                            <SelectContent>
                              {config.sillFinishes.map((finish) => (
                                <SelectItem key={finish} value={finish}>{finish}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Handle Prep</Label>
                          <Select
                            value={door.handle}
                            onValueChange={(value) => updateDoorConfig(door.id, 'handle', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Handle Prep" />
                            </SelectTrigger>
                            <SelectContent>
                              {config.handlePreps.map((prep) => (
                                <SelectItem key={prep} value={prep}>{prep}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {door.handle === 'GU Multipoint Lock System (Upcharge Applies)' && (
                            <div className="mt-2">
                              <Label>Handleset Options</Label>
                              <Select
                                value={handlesetOptions[door.id]}
                                onValueChange={(value) => updateHandlesetOption(door.id, value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Handleset Option" />
                                </SelectTrigger>
                                <SelectContent>
                                  {HANDLESET_OPTIONS.map((option) => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          {door.handle === 'Other (Please Specify)' && (
                            <Input
                              placeholder="Enter custom handle prep details"
                              value={customSpecs.handle}
                              onChange={(e) => setCustomSpecs(prev => ({...prev, handle: e.target.value}))}
                            />
                          )}
                        </div>

                        <div>
                          <Label>Door Swing</Label>
                          <Select
                            value={door.swing}
                            onValueChange={(value) => updateDoorConfig(door.id, 'swing', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Door Swing" />
                            </SelectTrigger>
                            <SelectContent>
                              {config.swings.map((swing) => (
                                <SelectItem key={swing} value={swing}>{swing}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Notes</Label>
                          <Input
                            className="h-24"
                            value={door.notes}
                            onChange={(e) => updateDoorConfig(door.id, 'notes', e.target.value)}
                            placeholder="Add any special instructions or notes here"
                            multiline
                          />
                        </div>

                        {door.model?.startsWith('Palermo') && (
                          <div>
                            <Label>Dentil Shelf</Label>
                            <Select
                              value={dentilShelfOptions[door.id]}
                              onValueChange={(value) => updateDentilShelf(door.id, value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select Dentil Shelf Option" />
                              </SelectTrigger>
                              <SelectContent>
                                {DENTIL_SHELF_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}

              <Button 
                className="w-full"
                variant="outline"
                onClick={addNewDoor}
              >
                Add Another Door
              </Button>

              <div className="flex flex-col gap-2">
                <Button 
                  className="w-full"
                  onClick={() => console.log('Submit:', { customerInfo, doorConfigs })}
                >
                  Submit Order
                </Button>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => setPage(1)}
                >
                  Back to Customer Info
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default DoorConfigurator;